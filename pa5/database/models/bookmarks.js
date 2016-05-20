'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bookmarks = sequelize.define('Bookmarks', {
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    keywords: DataTypes.STRING,
    favorite: DataTypes.BOOLEAN,
    isFolder: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // models.Bookmarks.belongsTo(models.Users, {constraints: true, foreignKey: {name: 'userId', allowNull:false }});
        models.Bookmarks.hasMany(models.Bookmarks, {foreignKey: {name: 'folderId', allowNull: false}, });
      }
    }
  });
  return Bookmarks;
};
