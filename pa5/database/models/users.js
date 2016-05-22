'use strict';
var bcrypt       = require('bcrypt');
const saltRounds = 10;

module.exports = function (sequelize, DataTypes) {
    var Users = sequelize
        .define('Users', {
                    name: {type: DataTypes.STRING, unique: 'action'},
                    password: {
                        type: DataTypes.STRING,
                        allowNull: false
                        // set: function (v) {
                        //     var salt   = bcrypt.genSaltSync(saltRounds);
                        //     var hash = bcrypt.hashSync(v, salt);
                        //
                        //     this.setDataValue('password', hash);
                        // }
                    }
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
                            Bookmarks.create({
                                                 name: 'root',
                                                 userId: user.id,
                                                 isFolder: true,
                                                 favorite: false,
                                                 folderId: null
                                             });
                        }
                    }
                });
    return Users;
};
