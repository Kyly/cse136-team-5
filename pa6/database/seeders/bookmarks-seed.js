'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Bookmarks', [
            {
                id: 1,
                name: "root",
                keywords: "seed",
                description: "root directory created automaticaly",
                isFolder: true,
                userId: 1
            },
            {
                id: 2,
                name: "My Folder",
                keywords: "seed",
                description: "A folder example",
                isFolder: true,
                userId: 1,
                folderId: 1
            },
            {
                name: "root",
                keywords: "seed",
                description: "root directory created automaticaly",
                isFolder: true,
                userId: 2
            },
            {
                name: "root",
                keywords: "seed",
                description: "root directory created automaticaly",
                isFolder: true,
                userId: 3
            },
            {
                url: "https://github.com/",
                name: "a",
                description: "A is a bookmarks",
                keywords: "seed",
                favorite: true,
                isFolder: false,
                folderId: 1,
                userId: 1
            }, {
                url: "https://github.com/",
                name: "b",
                description: "B is a bookmarks",
                keywords: "seed",
                favorite: false,
                isFolder: false,
                folderId: 1,
                userId: 1
            }, {
                url: "https://github.com/Kyly",
                name: "c",
                description: "C is a bookmarks",
                keywords: "seed",
                favorite: true,
                isFolder: false,
                folderId: 1,
                userId: 1
            }, {
                url: "https://github.com/Kyly",
                name: "d",
                description: "D is a bookmark in a My Folder",
                keywords: "seed",
                favorite: false,
                isFolder: false,
                folderId: 2,
                userId: 1
            }], {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Bookmarks', {keywords: 'seed'});
    }
};
