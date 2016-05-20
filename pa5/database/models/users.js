'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    name: {type:DataTypes.STRING, unique: 'action'},
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.Users.hasMany(models.Bookmarks, {constraints: true, foreignKey: {name: 'userId', allowNull:false }});
      }
    }
  });
  return Users;
};
