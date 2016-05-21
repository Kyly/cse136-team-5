var Models    = require('../database/models'), Users = Models.Users, Bookmarks = Models.Bookmarks;
var validUrl  = require('valid-url');
var Sequelize = require('sequelize');

function BookmarkApi() {
    api = this;
}

BookmarkApi.prototype.getList = function (req, res) {
    var search   = req.query['search'] ? req.query.search : undefined;
    var folderId = req.query['folderId'] ? req.query.folderId : req.session.folderId ? req.session.folderId : 1;
    var sortBy   = req.query['sortBy'] ? req.query.sortBy : req.session.sortBy ? req.session.sortBy : 'name';

    req.session.folderId = folderId;
    req.session.sortBy   = sortBy;

    var uid = req.session.uid;

    var bookmarks = {
        where: {
            folderId: folderId,
            userId: uid
        },
        order: [[sortBy, 'ASC']]
    };

    if (search)
    {
        bookmarks.where.name = {
            $like: search
        }
    }

    var query = Bookmarks.findAll(bookmarks);

    query.then((list) => res.json(list));

    query.catch((error) => res.status(500).json({message: error.message}));
};

BookmarkApi.prototype.create = function (req, res) {
    var newBookmark      = req.body;
    newBookmark.favorite = 0;
    newBookmark.userId   = req.session.uid;
    var validation       = api.validate(newBookmark);
    if (!validation.isValid)
    {
        return res.status(403).json(validation);
    }

    var create = Bookmarks.create(newBookmark);

    create.then(()=> res.status(204).send());

    create.catch((error) => {
        console.log(error);

        if (error.name === 'SequelizeUniqueConstraintError')
            res.status(409).json({type: error.message, message: error.errors[0].message});
    });
};

BookmarkApi.prototype.update = function (req, res) {
    var bookmark    = req.body;
    var id          = parseInt(req.params.bookId);
    bookmark.userId = req.session.uid;
    var validation  = api.validate(bookmark);

    if (!validation.isValid)
    {
        return res.status(404).json(validation);
    }

    var update = Bookmarks.update(bookmark, {where: {id: id}});

    update.then((updated) => {
        console.log(updated);
        if (!updated[0])
        {
            return res.status(404).json({message: `Bookmark with ${id} not found`});
        }
        res.status(204).send();
    });

    update.catch((error) => res.status(500).json({message: error.message}));
};

BookmarkApi.prototype.delete = function (req, res) {
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
        return res.status(500).json({message: error.message})
    });

};

BookmarkApi.prototype.validate = function (bookmark) {
    var validation = {isValid: true};
    if (bookmark.url && !validUrl.isUri(bookmark.url))
    {
        validation.isValid = false;
        validation.message = `Uri ${bookmark.uri} is not a valid URI`;
        return validation;
    }

    return validation;
};

module.exports = new BookmarkApi();