var _        = require('lodash');
var fs       = require('fs');
var db       = require('../database/db');
var sql      = require('sql-query'), sqlQuery = sql.Query();
var csv      = require('../services/csvToJson');
var validUrl = require('valid-url'); //npm install valid-url

module.exports.errorHandler = function (err, req, res, next) {
    console.error(err.stack);
    req.reportedError = err;
    renderIndex(req, res);
};

module.exports.parseFile = function parseFile(req, res) {

    function onNewRecord(record) {
        for (var key in record)
        {
            if (!record.hasOwnProperty(key))
            {
                continue;
            }

            record[key].uid = req.session.uid;
            insertBookmark(record[key], function (err) {
                console.error(err);
                req.reportedError = err;
            }, function (el) {
                console.log(`Successfully inserted ${JSON.stringify(el)}`);
            });
        }
    }

    function onError(error) {
        req.reportedError = error;
        renderIndex(req, res);
    }

    function done() {
        req.message = "Upload successful!";
        renderIndex(req, res);
    }

    if (req.file && req.file.buffer)
    {
        csv.parseCSVFile(req.file.buffer, onNewRecord, onError, done);
    }
    else
    {
        req.reportedError = {message: 'No file received', name: 'No file', status: 403};
        renderIndex(req, res);
    }

};

var list = module.exports.list = function (req, res) {
    renderIndex(req, res);
};

function renderIndex(req, res, scopeCallBack) {

    var sql;
    var search   = req.query['search'] ? db.escape(req.query.search) : null;
    var folderId = req.query['folderId'] ? db.escape(req.query.folderId) : req.session.folderId ? req.session.folderId : 1;
    var sortBy   = req.query['sortBy'] ? req.query.sortBy : req.session.sortBy ? req.session.sortBy : 'name';

    req.session.folderId = folderId;
    req.session.sortBy   = sortBy;

    var uid = req.session.uid;
    if (search)
    {
        search = '% ' + req.query['search'] ? db.escape(req.query.search) : null + ' %';
        sql    = `SELECT * FROM Bookmarks WHERE name LIKE ${search} AND folderId = ${folderId} AND uid = ${uid} ORDER BY ${sortBy} ASC`;
    }
    else
    {
        sql = `SELECT * FROM Bookmarks WHERE folderId = ${folderId} AND uid = ${uid} ORDER BY ${sortBy} ASC`;
    }
    console.log(sql);
    db.query(sql, function (err, bookmarks) {
        if (err)
        {
            console.error(err);
            req.reportedError = err;
        }

        var folders;
        if (bookmarks)
        {
            getFolders(bookmarks);
        }


        
        var showBack = folderId == 1 ? false : true;
        console.error(showBack);
        
        var scope = {
            bookmarks: bookmarks,
            showCreateDialog: req.showCreateDialog,
            showEditDialog: req.showEditDialog,
            showUploadDialog: req.showUploadDialog,
            showCreateFolderDialog: req.showCreateFolderDialog,
            showConfirmDeleteDialog: req.showConfirmDeleteDialog,
            showEditFolderDialog: req.showEditFolderDialog,
            folders: folders,
            error: req.reportedError,
            showBack: showBack
        };

        if (scopeCallBack)
        {
            scopeCallBack(scope);
        }

        res.render('index', scope);
    });
}

module.exports.getBookmarks = function (req, res, next) {
    var uid       = req.session.uid;
    var sqlSelect = sqlQuery.select();

    var sql = sqlSelect.from('Bookmarks').where({uid: uid}).build();
    console.log(sql);

    db.query(sql, function (err, bookmarks) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }

        req.bookmarks = bookmarks;
        next();
    });
};

module.exports.getCSV = function (req, res) {
    if (!req.reportedError)
    {
        csv.parseJsonToCSV(req.bookmarks, handleError, done);
    }

    function done(csv) {
        res.set({'Content-Disposition': 'attachment; filename="bookmarks.csv"'});
        res.status(200).send(csv);
    }

    function handleError(err) {
        res.status(500).send({error: err});
    }
};

/**
 *
 * Selects information about passed in book and then
 * renders the delete confirmation page with the delete.ejs template
 */
module.exports.confirmDelete = function (req, res) {
    req.showConfirmDeleteDialog = true;
    renderEdit(req, res);
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
    function editDialogeScope(scope) {
        scope.folders = getFolders(scope.bookmarks);
    }

    renderIndex(req, res, editDialogeScope);
};

module.exports.editBookmark = function (req, res) {
    req.showEditDialog = true;
    renderEdit(req, res);
};

function renderEdit(req, res) {
    var id = req.query.id;

    function editDialogeScope(scope) {
        scope.folders      = getFolders(scope.bookmarks);
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
    var uid    = req.session.uid;

    delete req.body.action;

    var sql;

    if (action === 'create')
    {
        var update = sqlQuery.update();
        sql        = update.into('Bookmarks').set(req.body).where({id: id, uid: uid}).build();
    }
    else
    {
        sql = `DELETE FROM Bookmarks WHERE id=${db.escape(id)} AND uid = ${uid}`;
    }

    console.log(action, sql);
    db.query(sql, function (err, response) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }
        console.log(response);
        renderIndex(req, res);
    });
};

module.exports.delete = function (req, res) {
    var id  = req.params.book_id;
    var uid = req.session.id;

    db.query(`DELETE from Bookmarks where uid = ${uid} AND id = ${id}`, function (err) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }
        renderIndex(req, res);
    });
};

/**
 * Adds a new book to the database
 * Does a redirect to the list page
 */
module.exports.insert = function (req, res) {
    var sqlInsert           = sqlQuery.insert();
    var newBookmark         = {};
    newBookmark.url         = req.body.url;
    newBookmark.name        = req.body.name;
    newBookmark.folderId    = req.body.folderId;
    newBookmark.description = req.body.description;
    newBookmark.keywords    = req.body.keywords;
    newBookmark.favorite    = 0;
    newBookmark.folder      = "FALSE";
    newBookmark.uid         = req.session.uid;

    if (validUrl.isUri(newBookmark.url))
    {
        console.log('Looks like an URI');
    }
    else
    {
        console.log('Not a URI');
        req.reportedError = {message: 'URI is inlaid', name: 'Bad Url given', status: 403};
        renderIndex(req, res);
        return;
    }

    var queryString = sqlInsert.into('Bookmarks').set(newBookmark).build();
    console.log(queryString);

    db.query(queryString, function (err) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }
        renderIndex(req, res);
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
    var sqlInsert         = sqlQuery.insert();
    var newFolder         = {};
    newFolder.folderId    = req.session.folderId ? req.session.folderId : 1;
    newFolder.name        = req.body.name;
    newFolder.description = req.body.description;
    newFolder.favorite    = 0;
    newFolder.folder      = true;
    newFolder.uid         = req.session.uid;

    var queryString = sqlInsert.into('Bookmarks').set(newFolder).build();
    console.log(queryString);
    db.query(queryString, function (err) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }

        renderIndex(req, res);
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
    var uid         = req.session.uid;

    if (validUrl.isUri(url))
    {
        console.log('Looks like an URI');
    }
    else
    {
        console.log('Not a URI');
        req.reportedError = {message: 'URI is inlaid', name: 'Bad Url given', status: 403};
        renderIndex(req, res);
    }

    var queryString = 'UPDATE Bookmarks SET url = ' + url + ', name = ' + name + ', description = '
        + description + ', keywords = ' + keywords + ' WHERE id = ' + id + ' AND uid = ' + uid;
    db.query(queryString, function (err) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }
        renderIndex(req, res);
    });

};

function search(req, res) {
    var uid      = req.session.uid;
    var keywords = req.query['keywords'] ? db.escape(req.query.keywords) : 'keywords';
    var sql      = sqlSelect.from('Bookmarks').where({col: sql.like(' keywords '), uid: uid}).build();

    console.log(action, sql);
    db.query(sql, function (err, response) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
        }

        console.log(response);
        renderIndex(req, res);
    });
}

module.exports.search = function (req, res) {
    var search       = req.body.keywords;
    req.query.search = search;
    renderIndex(req, res);
};

module.exports.favorite = function (req, res) {
    var id  = req.query.id;
    var fav = req.query.fav;
    var uid = req.session.uid;

    fav             = (fav + 1) % 2;
    var queryString = 'UPDATE Bookmarks SET favorite = ' + fav + ' WHERE id = ' + id + ' AND uid = ' + uid;
    db.query(queryString, function (err) {
        if (err)
        {
            req.reportedError = err;
            console.error(err);
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
            req.reportedError = err;
            console.error(err);
        }
        next();
    });
};

module.exports.defaultView = function (req, res) {
    renderIndex(req, res);
};

module.exports.sort = function (req, res) {
    var option       = req.body.options;
    req.query.sortBy = option;
    renderIndex(req, res);
};

module.exports.createFolder = function (req, res) {
    req.showCreateFolderDialog = true;
    renderIndex(req, res);
};

module.exports.showEditFolder = function (req, res) {
    req.showEditFolderDialog = true;
    renderEdit(req, res);
};

module.exports.home = function (req, res) {
    req.session.folderId = 1;
    renderEdit(req, res);
};
