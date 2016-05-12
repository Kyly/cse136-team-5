/*  TODO: Add Function Blocks

 */

var db = require('../database/db');

/**
 *
 * Selects all Bookmarks and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, res) {
  db.query('SELECT * from Bookmarks ORDER BY id', function(err, Bookmarks) {
    if (err) throw err;
    res.render('index', {bookmarks: Bookmarks});
  });
};

/**
 *
 * Selects information about passed in book and then
 * renders the delete confirmation page with the delete.ejs template
 */
module.exports.confirmdelete = function(req, res){
  var id = req.params.book_id;
  db.query('SELECT * from Bookmarks WHERE id =  ' + id, function(err, book) {
    if (err) throw err;
    res.render('bookmarks/delete', {book: book[0]});
  });
};

/**
 *
 * Renders the add page with the add.ejs template
 */
module.exports.add = function(req, res) {
  res.render('bookmarks/addBookmark');
};

/**
 *
 * Renders the add folder page with the addFolder.ejs template
 */

module.exports.addFolder = function(req, res) {
  res.render('bookmarks/addFolder');
};

module.exports.import = function(req, res) {
  res.render('bookmarks/import');
};

/**
 *
 * Selects information about the passed in bood and then
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
  var id = req.params.book_id;
  db.query('SELECT * from Bookmarks WHERE id =  ' + id, function(err, bookmark) {
    if (err) throw err;

    res.render('bookmarks/edit', {bookmark: bookmark[0]});
  });
};

/**
 * Deletes the passed in book from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
  var id = req.params.book_id;
  db.query('DELETE from Bookmarks where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/bookmarks');
  });
};

/**
 * Adds a new book to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res){
  var url = db.escape(req.body.url);
  var name = db.escape(req.body.name);
  var folderId = db.escape(req.body.folderId);
  var description = db.escape(req.body.description);
  var keywords = db.escape(req.body.keywords);
  var favorite = 0;
    

  var queryString = 'INSERT INTO Bookmarks (url, name, folderId, description, keywords, favorite) VALUES (' + url + ', ' + name + ', ' + folderId + ', ' + description + ', ' + keywords + ', ' + favorite + ')';
  console.log(queryString);

  db.query(queryString, function(err){
    res.redirect('/bookmarks');
  });
};

/**
 * Updates a book in the database
 * Does a redirect to the list page
 */
module.exports.update = function(req, res){
  var id = req.params.book_id;
  var url = db.escape(req.body.url);
  var name = db.escape(req.body.name);
  var description = db.escape(req.body.description);
  var keywords = db.escape(req.body.keywords);

  var queryString = 'UPDATE Bookmarks SET url = ' + url + ', name = ' + name + ', description = ' + description + ', keywords = ' + keywords + ' WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/bookmarks');
  });
};

/**
 * Search:
 * SELECT * FROM Bookmarks WHERE keywords LIKE '% ' + keywords +' %';
 * Sort:
 * SELECT * FROM Bookmarks ORDER BY name ASC;
 * Visit: a href tag
 * add=insert edit=update delete list
 */