'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface
            .createTable('Bookmarks',
                         {
                             id: {
                                 allowNull: false,
                                 autoIncrement: true,
                                 primaryKey: true,
                                 type: Sequelize.INTEGER
                             },
                             url: {type: Sequelize.STRING, isUrl: true},
                             name: {type: Sequelize.STRING, unique: 'compositeIndex'},
                             description: Sequelize.TEXT,
                             keywords: Sequelize.STRING,
                             favorite: {type: Sequelize.BOOLEAN, defaultValue: false},
                             isFolder: {type: Sequelize.BOOLEAN, defaultValue: false},
                             userId: {type: Sequelize.INTEGER, unique: 'compositeIndex', allowNull: false},
                             folderId: {
                                 type: Sequelize.INTEGER,
                                 unique: 'compositeIndex',
                                 defaultValue: 1,
                                 allowNull: true
                             },
                             createdAt: {
                                 allowNull: false,
                                 type: Sequelize.DATE
                             },
                             updatedAt: {
                                 allowNull: false,
                                 type: Sequelize.DATE
                             }
                         },
                         {
                             uniqueKeys: [{
                                 name: 'Unique_Bookmark_Constraint',
                                 singleField: false,
                                 fields: ['folderId', 'userId', 'name']
                             }]
                         }
            );
    },
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Bookmarks')

};
