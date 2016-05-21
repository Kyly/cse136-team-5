'use strict';
module.exports = function (sequelize, DataTypes) {
    var Bookmarks = sequelize
        .define('Bookmarks',
                {
                    url: {type: DataTypes.STRING, isUrl: true},
                    name: {type: DataTypes.STRING, unique: 'compositeIndex'},
                    description: DataTypes.TEXT,
                    keywords: DataTypes.STRING,
                    favorite: {type: DataTypes.BOOLEAN, defaultValue: false},
                    isFolder: {type: DataTypes.BOOLEAN, defaultValue: false},
                    userId: {type: DataTypes.INTEGER, unique: 'compositeIndex', allowNull: false},
                    folderId: {type: DataTypes.INTEGER, unique: 'compositeIndex', defaultValue: 1, allowNull: true}
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
