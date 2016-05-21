'use strict';
module.exports = function (sequelize, DataTypes) {
    var Bookmarks = sequelize
        .define('Bookmarks',
                {
                    url: DataTypes.STRING,
                    name: {type: DataTypes.STRING, unique: 'compositeIndex'},
                    description: DataTypes.TEXT,
                    keywords: DataTypes.STRING,
                    favorite: DataTypes.BOOLEAN,
                    isFolder: DataTypes.BOOLEAN,
                    userId: {type: DataTypes.INTEGER, unique: 'compositeIndex'},
                    folderId: {type: DataTypes.INTEGER, unique: 'compositeIndex'}
                },
                {
                    classMethods: {
                        associate: function (models) {
                            // models.Bookmarks.belongsTo(models.Users, {constraints: true, foreignKey: {name: 'userId', allowNull:false }});
                            models.Bookmarks.hasMany(models.Bookmarks, {foreignKey: {name: 'folderId'}});
                        }
                    }
                });
    return Bookmarks;
};
