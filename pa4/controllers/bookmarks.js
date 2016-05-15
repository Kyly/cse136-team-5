
var _ = require('lodash');
var db = require('../database/db');
var sql = require('sql-query'), sqlQuery = sql.Query();


var list = module.exports.list = function (req, res) {
    renderIndex(req, res);
};

function renderIndex(req, res) {
    console.info('List request', req.query);
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : 1;
    var sortBy = req.query['sortBy'] ? db.escapeId(req.query.sortBy) : 'name';

    db.query(`SELECT * FROM Bookmarks WHERE folderId = ${folderId} ORDER BY ${sortBy}`, function (err, bookmarks) {
        if (err)
        {
            throw err;
        }
        
        var folders = getFolders(bookmarks);
        res.render('index', {
            bookmarks: bookmarks, 
            showCreateDialog: req.showCreateDialog,
            showEditDialog: req.showEditDialog,
            folders: folders
        });
    });
}




module.exports.confirmdelete = function (req, res) {
    var id = req.params.book_id;
    db.query('SELECT * from Bookmarks WHERE id =  ' + id, function (err, book) {
        if (err)
        {
            throw err;
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

module.exports.editBookmark = function(req, res) {
    req.showEditDialog = true;
    renderEdit(req, res);
};


function renderEdit(req, res) {
    console.info('List request', req.query);
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : 1;
    var sortBy = req.query['sortBy'] ? db.escapeId(req.query.sortBy) : 'name';
    var id = req.body.id;
    
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
    var id = parseInt(req.params.bookId);
    var action = req.body.action;
    delete req.body.action;

    var sql;

    if (action === 'Update') {
        var update = sqlQuery.update();
        sql = update.into('Bookmarks').set(req.body).where({id: id}).build();
    } else {
        sql = `DELETE FROM Bookmarks WHERE id=${db.escape(id)}`;
    }

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
};


module.exports.delete = function (req, res) {
    var id = req.params.book_id;
    db.query('DELETE from Bookmarks where id = ' + id, function (err) {
        if (err)
        {
            throw err;
        }
        res.redirect('/bookmarks');
    });
};


module.exports.insert = function(req, res){
  var url = db.escape(req.body.url);
  var name = db.escape(req.body.name);
  var folderId = db.escape(req.body.folderId);
  var description = db.escape(req.body.description);
  var keywords = db.escape(req.body.keywords);
  var favorite = 0;
  var folder = "FALSE";

  var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
  console.log(queryString);

  db.query(queryString, function(err){
    res.redirect('/bookmarks');
  });
};


module.exports.insertFolder = function(req, res){
	var url = "NULL";
	var folderId = 1;
	var keywords = "NULL";
    var name = db.escape(req.body.name);
    var description = db.escape(req.body.description);
    var favorite = 0;
    var folder = "TRUE";
    var parent = 1;
    
    
    var queryString = 'INSERT INTO Folders (name, parent) VALUES (' + name + ', ' + parent + ')';
    console.log(queryString);
    db.query(queryString, function(err){
        //res.redirect('/bookmarks');
    });
    
	var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite, folder) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ', ' + folder + ')';
  	console.log(queryString);
  	db.query(queryString, function(err){
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
        if (err)
        {
            throw err;
        }
        res.redirect('/bookmarks');
    });
};

module.exports.favorite = function (req, res) {
    var id  = req.params.id;
    var fav = req.params.favorite;
    var queryString = 'UPFDATE Bookmarks SET favorite = ' + fav  + 'WHERE id = '  + id; 

};


/**
 * Search:
 * SELECT * FROM Bookmarks WHERE keywords LIKE '% ' + keywords +' %';
 * Sort:
 * SELECT * FROM Bookmarks ORDER BY name ASC;
 * Visit: a href tag
 * add=insert edit=update delete list
 */