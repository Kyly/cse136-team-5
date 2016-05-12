var config = require('./config');
var db     = require('./db');
var bookmarks  = require('./bookmarks');
var users  = require('./users');

db.init();

var express    = require('express');
var bodyParser = require('body-parser');
var session    = require('express-session');
var mySession = session({
  secret: 'N0deJS1sAw3some',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

var app = express();
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
app.get('/logout', users.logout);

/*  This must go between the users routes and the books routes */
app.use(users.auth);

app.get('/bookmarks', bookmarks.list);
app.get('/bookmarks/add', bookmarks.add);
app.get('/bookmarks/addFolder', bookmarks.addFolder);
app.get('/bookmarks/import', bookmarks.import);
app.get('/bookmarks/edit/:book_id(\\d+)', bookmarks.edit);
app.get('/bookmarks/confirmdelete/:book_id(\\d+)', bookmarks.confirmdelete);
app.get('/bookmarks/delete/:book_id(\\d+)', bookmarks.delete);
app.post('/bookmarks/update/:book_id(\\d+)', bookmarks.update);
app.post('/bookmarks/insert', bookmarks.insert);

app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});

