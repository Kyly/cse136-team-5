var _         = require('lodash');
var db        = require('../database/db');
var sql       = require('sql-query'), sqlQuery = sql.Query();
var converter = require('../services/csvToJson');
var validUrl = require('valid-url'); //npm install valid-url
var reportedError = null;

function parseCSVFile(buffer, onNewRecord, handleError, done) {
    var source = String.fromCharCode.apply(null, buffer);

    converter.fromString(source, function (err, result) {
        if (err)
        {
            handleError(err)
        }

        onNewRecord(result);
        done();
    });
}

module.exports.parseFile = function parseFile(req, res, next) {
    var buffer = req.file.buffer;

    function onNewRecord(record) {
        for (var key in record)
        {
            if (!record.hasOwnProperty(key))
            {
                continue;
            }

            insertBookmark(record[key], function (err) {
                console.error(err);
                throw err;
            }, function (el) {
                console.log(`Successfully inserted ${JSON.stringify(el)}`);
            });
        }
    }

    function onError(error) {
        reportedError = error;
        renderIndex(req, res);
    }

    function done() {
        req.message = "Upload successful!";
        renderIndex(req, res);
    }

    parseCSVFile(buffer, onNewRecord, onError, done);

};

var list = module.exports.list = function (req, res) {
    renderIndex(req, res);
};




function renderIndex(req, res, scopeCallBack) {

    if (reportedError != null)
    {
        console.error(reportedError);
        res.render('index', {error: err});
        reportedError = null;
        return;
    }

    var search = req.query['search'] ? db.escape(req.query.search): null;
    var sql;
    console.info('List request', req.query);
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : 1;
    var sortBy   = req.query['sortBy'] ? req.query.sortBy : 'name';

    req.session.folderId = folderId;
    req.session.sortBy = sortBy;

    if(search){
        search = '% ' + req.query['search'] ? db.escape(req.query.search): null + ' %';
        sql = `SELECT * FROM Bookmarks WHERE name LIKE ${search} AND folderId = ${folderId} ORDER BY ${sortBy} ASC`;
    }
    else{
        sql = `SELECT * FROM Bookmarks WHERE folderId = ${folderId} ORDER BY ${sortBy} ASC`;
    }
    console.log(sql);
    db.query(sql, function (err, bookmarks) {
        if (err)
        {
            console.error(err);
            res.render('index', {error: err});
            return;
        }

        var folders = getFolders(bookmarks);
        var scope = {
            bookmarks: bookmarks,
            showCreateDialog: req.showCreateDialog,
            showEditDialog: req.showEditDialog,
            showUploadDialog: req.showUploadDialog,
            showCreateFolderDialog: req.showCreateFolderDialog,
            folders: folders
        };

        if (scopeCallBack) {
            scopeCallBack(scope);
        }

        res.render('index', scope);
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
module.exports.confirmdelete = function (req, res) {
    var id = req.params.book_id;
    db.query('SELECT * from Bookmarks WHERE id =  ' + id, function (err, book) {
        if (err)
        {
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
    var sortBy = req.query['sortBy'] ? req.query.sortBy : 'name';
    var id = req.query.id;

    db.query(`SELECT * FROM Bookmarks WHERE folderId = ${folderId} ORDER BY ${sortBy}`, function (err, bookmarks) {
        if (err) {
            throw err;
        }

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

    function editDialogeScope(scope) {
        scope.folders = getFolders(scope.bookmarks);
        scope.bookmarkItem = getBookmarkFromId(id, scope.bookmarks);
    }

    renderIndex(req, res, editDialogeScope);
}
function getFolders(bookmarks) {
    return bookmarks.filter(function (bookmark) {
        return bookmark.folder;
    });
}

function getBookmarkFromId(id, bookmarks) {
    return bookmarks.filter(function (bookmark) {
        if (bookmark.id == id)
        {
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
        if (err)
        {
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
        if (err)
        {
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

  if (validUrl.isUri(url)){
    console.log('Looks like an URI');
  } else {
    console.log('Not a URI');
      res.render('403', { status: 403, bookmarks: bookmarks });
  }

  var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
  console.log(queryString);

    db.query(queryString, function (err) {
        if (err)
        {
            reportedError = err;
            console.error(err);
        }
        res.redirect('/bookmarks');
    });
};

function insertBookmark(bookmark, onError, done) {
    var sqlInsert = sqlQuery.insert();
    var sql       = sqlInsert.into('Bookmarks').set(bookmark).build();

    db.query(sql, function (err) {
        if (err)
        {
            console.log(err);
            onError(err);
            return false;
        }

        if (done)
        {
            done(bookmark);
        }
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
    db.query(queryString, function (err) {
        if (err)
        {
            reportedError = err;
            console.error(err);
            res.redirect('/bookmarks');
        }
        //res.redirect('/bookmarks');
    });

    var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
    console.log(queryString);
    db.query(queryString, function (err) {
        if (err)
        {
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

    if (validUrl.isUri(url)){
        console.log('Looks like an URI');
    } else {
        console.log('Not a URI');
        res.render('403', { status: 403, bookmarks: bookmarks });
    }

    var queryString = 'UPDATE Bookmarks SET url = ' + url + ', name = ' + name + ', description = ' + description + ', keywords = ' + keywords + ' WHERE id = ' + id;
    db.query(queryString, function (err) {
        if (err)
        {
            reportedError = err;
            console.error(err);
        }
        res.redirect('/bookmarks');
    });


};

function search(req, res) {
    var keywords = req.query['keywords'] ? db.escape(req.query.keywords) : 'keywords';
    var sql = sqlSelect.from('Bookmarks').where({ col: sql.like(' keywords ') }).build();

    console.log(action, sql);
    db.query(sql, function (err, response) {
        if (err)
        {
            res.redirect('/bookmarks');
            throw err;
        }

        console.log(response);
        res.redirect('/bookmarks');
    });
}

module.exports.search = function(req, res){
  var search = req.body.keywords;
  req.query.search = search;
    renderIndex(req,res);
};

module.exports.favorite = function (req, res) {
    var id          = req.query.id;
    var fav         = req.query.fav;
    fav             = (fav + 1) % 2;
    var queryString = 'UPDATE Bookmarks SET favorite = ' + fav + ' WHERE id = ' + id;
    db.query(queryString, function (err) {
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
    upload(req, res, function (err) {
        if (err)
        {
            return res.end("Error uploading file.");
        }
        next();
    });
};

module.exports.defaultView = function (req, res) {
    renderIndex(req, res);
};

module.exports.sort = function(req, res){
    var option = req.body.options;
    req.query.sortBy = option;
    renderIndex(req,res);
}


module.exports.createFolder = function (req, res) {
    console.log('making a foler');
    req.showCreateFolderDialog = true;
    renderIndex(req, res);
};
