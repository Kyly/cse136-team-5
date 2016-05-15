
var _   = require('lodash');
var db  = require('../database/db');
var sql = require('sql-query'), sqlQuery = sql.Query();

var reportedError = null;

var Converter = require("csvtojson").Converter;
var converter = new Converter({
    noheader: true,
    headers: ['url', 'folderId', 'name', 'description', 'keywords', 'favorite', 'folder'],
    maxRowLength: '2000',
    checkColumn: true
});

function parseCSVFile(buffer, onNewRecord, handleError, done){
    var source = String.fromCharCode.apply(null, buffer);

    converter.fromString(source, function(err,result){
        if (err) {
            handleError(err)
        }

        onNewRecord(result);
        done();
    });
}

module.exports.parseFile = function parseFile(req, res, next){
    var buffer = req.file.buffer;
    function onNewRecord(record){
        for (var key in record) {
            if (!record.hasOwnProperty(key)) {
                continue;
            }

            insertBookmark(record[key], function(err) {
                console.error(err);
                throw err;
            }, function(el) {
                console.log(`Successfully inserted ${JSON.stringify(el)}`);
            });
        }
    }

    function onError(error){
        reportedError = error;
        renderIndex(req, res);
    }

    function done(){
        req.message = "Upload successful!";
        renderIndex(req, res);
    }

    parseCSVFile(buffer, onNewRecord, onError, done);

};

var list = module.exports.list = function (req, res) {
    renderIndex(req, res);
};

function renderIndex(req, res) {
    if (reportedError != null) {
        console.error(reportedError);
        res.render('index', {error: err});
        reportedError = null;
        return;
    }
    
    console.info('List request', req.query);
    // var sessionFolderId = 
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : 1;
    var sortBy   = req.query['sortBy'] ? db.escapeId(req.query.sortBy) : 'name';

    db.query(`SELECT * FROM Bookmarks WHERE folderId = ${folderId} ORDER BY ${sortBy}`, function (err, bookmarks) {
        if (err) {
            console.error(err);
            res.render('index', {error: err}); 
            return;
        }

        var folders = getFolders(bookmarks);
        res.render('index', {
            bookmarks: bookmarks,
            showCreateDialog: req.showCreateDialog,
            showEditDialog: req.showEditDialog,
            showUploadDialog: req.showUploadDialog,
            folders: folders
        });
    });
}

function getFolders(bookmarks) {
    return bookmarks.filter(function (bookmark) {
        return bookmark.folder;
    });
}

/**
 *
 * Selects information about passed in book and then
 * renders the delete confirmation page with the delete.ejs template
 */
module.exports.confirmdelete = function(req, res){
  var id = req.params.book_id;
  db.query('SELECT * from Bookmarks WHERE id =  ' + id, function(err, book) {
    if (err) {
      reportedError = err;
      res.redirect('/bookmarks');
      return;
    }
    res.render('bookmarks/delete', {book: book[0]});
  });
};


module.exports.add = function (req, res) {
    res.render('bookmarks/addBookmark');
};



module.exports.addFolder = function (req, res) {
    res.render('bookmarks/addFolder');
};

module.exports.import = function (req, res) {
    res.render('bookmarks/import');
};

module.exports.create = function (req, res) {
    req.showCreateDialog = true;
    renderIndex(req, res);
};

module.exports.editBookmark = function (req, res) {
    req.showEditDialog = true;
    renderEdit(req, res);
};


function renderEdit(req, res) {
    console.info('List request', req.query);
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : 1;
    var sortBy = req.query['sortBy'] ? db.escapeId(req.query.sortBy) : 'name';
    var id = req.query.id;
    
    db.query(`SELECT * FROM Bookmarks WHERE folderId = ${folderId} ORDER BY ${sortBy}`, function (err, bookmarks) {
        if (err) { throw err; }
        
        var folders = getFolders(bookmarks);
        console.log('folders ', folders);
        console.log('id ', id);
        var bookmarkItem = getBookmarkFromId(id, bookmarks);
        console.log('Bm item ', bookmarkItem);

        res.render('index', {
            bookmarks: bookmarks,
            showCreateDialog: req.showCreateDialog,
            showEditDialog: req.showEditDialog,
            folders: folders,
            bookmarkItem: bookmarkItem
        });
    });
}

function getFolders(bookmarks) {
    return bookmarks.filter(function(bookmark) {
        return bookmark.folder;
    });
}

function getBookmarkFromId(id, bookmarks) {
    return bookmarks.filter(function(bookmark) {
        if(bookmark.id == id) {
            return bookmark;
        }
    });
}

module.exports.edit = function (req, res) {
    var id     = parseInt(req.params.bookId);
    var action = req.body.action;
    delete req.body.action;

    var sql;

    if (action === 'Update')
    {
        var update = sqlQuery.update();
        sql        = update.into('Bookmarks').set(req.body).where({id: id}).build();
    }
    else
    {
        sql = `DELETE FROM Bookmarks WHERE id=${db.escape(id)}`;
    }

    console.log(action, sql);
    db.query(sql, function (err, response) {
        if (err) {
            reportedError = err;
            console.error(err);
        }
        console.log(response);
        res.redirect('/bookmarks');
    });
};


module.exports.delete = function (req, res) {
    var id = req.params.book_id;
    db.query('DELETE from Bookmarks where id = ' + id, function (err) {
       if (err) {
            reportedError = err;
            console.error(err);
        }
        res.redirect('/bookmarks');
    });
};

/**
 * Adds a new book to the database
 * Does a redirect to the list page
 */
module.exports.insert = function (req, res) {
    var url         = db.escape(req.body.url);
    var name        = db.escape(req.body.name);
    var folderId    = db.escape(req.body.folderId);
    var description = db.escape(req.body.description);
    var keywords    = db.escape(req.body.keywords);
    var favorite    = 0;
    var folder      = "FALSE";

    var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
    console.log(queryString);

  db.query(queryString, function(err){
      if (err) {
        reportedError = err;
        console.error(err);
      }
      res.redirect('/bookmarks');
  });
};

function insertBookmark(bookmark, onError, done) {
    var sqlInsert = sqlQuery.insert();
    var sql = sqlInsert.into('Bookmarks').set(bookmark).build();

    db.query(sql, function (err) {
        if (err) {
            console.log(err);
            onError(err);
            return false;
        }

        if ( done )
            done(bookmark);
    });

}

module.exports.insertFolder = function (req, res) {
    var url         = "NULL";
    var folderId    = 1;
    var keywords    = "NULL";
    var name        = db.escape(req.body.name);
    var description = db.escape(req.body.description);
    var favorite    = 0;
    var folder      = "TRUE";
    var parent      = 1;

    var queryString = 'INSERT INTO Folders (name, parent) VALUES (' + name + ', ' + parent + ')';
    console.log(queryString);
    db.query(queryString, function(err){
        if (err) {
            reportedError = err;
            console.error(err);
            res.redirect('/bookmarks');
        }
        //res.redirect('/bookmarks');
    });
    
	var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
  	console.log(queryString);
  	db.query(queryString, function(err){
        if (err) {
            reportedError = err;
            console.error(err);
        }
    	res.redirect('/bookmarks');
  	});
};

/**
 * Updates a book in the database
 * Does a redirect to the list page
 */
module.exports.update = function (req, res) {
    var id          = req.params.book_id;
    var url         = db.escape(req.body.url);
    var name        = db.escape(req.body.name);
    var description = db.escape(req.body.description);
    var keywords    = db.escape(req.body.keywords);

    var queryString = 'UPDATE Bookmarks SET url = ' + url + ', name = ' + name + ', description = ' + description + ', keywords = ' + keywords + ' WHERE id = ' + id;
    db.query(queryString, function (err) {
        if (err) {
            reportedError = err;
            console.error(err);
        }
        res.redirect('/bookmarks');
    });
};

module.exports.favorite = function (req, res) {
    var id  = req.query.id;
    var fav = req.query.fav;
    fav = (fav + 1) % 2;
    var queryString = 'UPDATE Bookmarks SET favorite = ' + fav  + ' WHERE id = '  + id;     
    db.query(queryString, function (err){
        if (err)
        {
            throw err;
        }
        renderIndex(req, res);
    });
    
};

module.exports.uploadDialog = function (req, res) {
    req.showUploadDialog = true;
    renderIndex(req, res);
};

module.exports.uploadFile = function (req, res, next) {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        next();
    });
};

module.exports.defaultView = function (req, res) {
    renderIndex(req, res);
};
