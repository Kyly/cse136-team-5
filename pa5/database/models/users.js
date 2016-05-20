'use strict';
module.exports = function (sequelize, DataTypes) {
    var Users = sequelize
        .define('Users', {
                    name: {type: DataTypes.STRING, unique: 'action'},
                    password: DataTypes.STRING
                },
                {
                    classMethods: {
                        associate: function (models) {
                            models.Users.hasMany(models.Bookmarks, {
                                constraints: true,
                                foreignKey: {name: 'userId', allowNull: false}
                            });
                        }
                    },
                    hooks: {
                        afterCreate: function (user) {
                            var Bookmarks = sequelize.models.Bookmarks;
                            Bookmarks.create({name: 'root', userId: user.id, isFolder: true, favorite: false});
                        }
                    }
                });
    return Users;
};
