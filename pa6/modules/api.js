var Models    = require('../database/models'), Users = Models.Users, Bookmarks = Models.Bookmarks;
var Csv       = require('./csvToJson');
var Sequelize = require('sequelize');
var api;

function BookmarkApi() {
    api = this;
}

BookmarkApi.prototype.getRootFolder = (req, res, next) => {
    var session = req.session;
    var userId  = session.uid;

    // if (session.folderId)
    // {
    //     return next();
    // }

    Bookmarks.find({where: {userId: userId, name: 'root'}}).then((root) => {
        session.rootId = root.id;
        next();
    }).catch((error)=> {
        res.status(400).json({message: error.message, errors: error.errors});
    }); // FIXME Need version for post back

};

BookmarkApi.prototype.getList = (req, res) => {
    var search   = req.query['search'] ? req.query.search : undefined;
    var folderId = req.query['folderId'] ? req.query.folderId : req.session.folderId ? req.session.folderId : req.session.rootId;
    var sortBy   = req.query['sortBy'] ? req.query.sortBy : req.session.sortBy ? req.session.sortBy : 'name';

    req.session.folderId = folderId;
    req.session.sortBy   = sortBy;

    var uid   = req.session.uid;
    var order = 'ASC';

    if (sortBy === 'favorite')
    {
        order = 'DESC';
    }

    var bookmarks = {
        where: {
            folderId: folderId,
            userId: uid
        },
        order: [[sortBy, order]]
    };

    if (search)
    {
        bookmarks.where.name = {
            $like: `%${search}%`
        }
    }
    var query;
    var parentId = undefined;
    if (req.session.rootId != folderId)
    {
        query = Bookmarks.find({where: {id: folderId}}).then((parent) => {
            parentId = parent.folderId;
            return Bookmarks.findAll(bookmarks);
        });
    }
    else
    {
        query = Bookmarks.findAll(bookmarks);
    }

    query.then((list) => {
        res.json({rootId: req.session.rootId, parentId: parentId, bookmarks: list});
    });

    query.catch((error) => res.status(500).json({message: error.message, errors: error.errors}));
};

BookmarkApi.prototype.getFolders = function (req, res) {
    var userId = req.session.uid;
    var query  = {
        where: {
            userId: userId,
            isFolder: true
        }
    };

    var folderQ = Bookmarks.findAll(query);

    folderQ.then(list => res.status(200).json(list));

    folderQ.catch(error => res.status(500).json({message: error.message, errors: error.errors}));
};

BookmarkApi.prototype.create = (req, res) => {
    var newBookmark      = req.body;
    newBookmark.favorite = 0;
    newBookmark.userId   = req.session.uid;

    newBookmark.folderId = newBookmark.folderId
        ? newBookmark.folderId : req.session.folderId
                               ? req.session.folderId : req.session.rootId;

    var create = Bookmarks.create(newBookmark);

    create.then(()=> {
        res.status(204).send();
    });

    create.catch((error) => {
        console.log(error);

        if (error.name === 'SequelizeUniqueConstraintError')
        {
            return res.status(409).json({message: error.message, errors: error.errors});
        }

        res.status(400).json({message: error.message, errors: error.errors});
    });
};

BookmarkApi.prototype.update = (req, res) => {
    var bookmark    = req.body;
    var id          = parseInt(req.params.bookId);
    bookmark.userId = req.session.uid;

    var update = Bookmarks.update(bookmark, {where: {id: id}});

    update.then((updated) => {
        console.log(updated);
        if (!updated[0])
        {
            return res.status(404).json({message: `Bookmark with ${id} not found`});
        }
        res.status(204).send();
    });

    update.catch((error) => {
        res.status(400).json({message: error.message, errors: error.errors})
    });
};

BookmarkApi.prototype.createBookmarkPerm = (req, res, next) => {
    var newBookmark = req.body;
    var userId      = req.session.uid;

    if (!newBookmark.folderId)
    {
        next();
        return;
    }

    var query = Bookmarks.find({id: newBookmark.folderId, userId: userId});

    query.then((result) => {
        next();
    });

    query.catch((error) => {
        res.status(409).json({name: error.message, message: error.errors[0].message});
    });

};

BookmarkApi.prototype.delete = (req, res) => {
    var id     = parseInt(req.params.bookId);
    var userId = req.session.uid;

    var destroy = Bookmarks.destroy({where: {id: id, userId: userId}});

    destroy.then((count) => {
        if (count < 1)
        {
            return res.status(404).json({message: `Bookmark with ${id} not found`});
        }

        res.status(204).send();
    });

    destroy.catch((error) => {
        res.status(400).json({message: error.message, errors: error.errors})
    });

};

BookmarkApi.prototype.parseFile = (req, res) => {

    if (!req.file || !req.file.buffer)
    {
        res.status(400).json({message: 'No file received'});
        return;
    }

    Csv.parseCSVFile(req.file.buffer, onNewRecord,
                     (error) => {
                         res.status(400).json({message: error.message});
                     },
                     () => {
                         console.log('Done reading csv');
                     });

    function onNewRecord(bookmarks) {

        bookmarks.forEach((bookmark) => {
            bookmark.userId = req.session.uid;
            bookmark.folderId = req.session.rootId;
        });

        var bulkCreate = Bookmarks.bulkCreate(bookmarks);

        bulkCreate.then((created) => {
            console.log(created);
            res.status(204).send();
        });

        bulkCreate.catch((error) => {
            if (error.name === 'SequelizeUniqueConstraintError')
            {
                res.status(409).json({name: error.message, message: error.errors[0].message});
            }

            res.status(400).json({name: error.message, message: error.errors[0].message});
        });
    }

};

module.exports = new BookmarkApi();

