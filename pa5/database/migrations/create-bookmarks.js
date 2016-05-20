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
                             url: {
                                 type: Sequelize.STRING
                             },
                             name: {
                                 type: Sequelize.STRING,
                                 allowNull: false
                             },
                             description: {
                                 type: Sequelize.TEXT
                             },
                             keywords: {
                                 type: Sequelize.STRING
                             },
                             favorite: {
                                 type: Sequelize.BOOLEAN,
                                 allowNull: false
                             },
                             isFolder: {
                                 type: Sequelize.BOOLEAN,
                                 allowNull: false
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Bookmarks');
    }
};
