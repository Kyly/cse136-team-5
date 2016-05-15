var db          = require('./database/db');
var config      = require('./config');
var bookmarks   = require('./controllers/bookmarks');
var users       = require('./controllers/users');
var express     = require('express');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var handlebars  = require('express-handlebars');
var favicon     = require('serve-favicon');
var path        = require('path');
var queryParser = require('express-query-int');
var multer      = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage })

db.init();
var mySession = session(
    {
        secret: 'N0deJS1sAw3some',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false}
    }
);

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',
           handlebars(
               {
                   extname: '.hbs',
                   helpers: {
                       toJSON: function (object) {
                           return JSON.stringify(object);
                       }
                   }
               }
           )
);

app.set('view engine', '.hbs');
app.use(favicon(__dirname + '/assets/img/favicon.ico'));
app.use(queryParser());
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
// app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({extended: true}));

/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
app.get('/logout', users.logout);

/*  This must go between the users routes and the books routes */
app.use(users.auth);

app.get('/bookmarks', bookmarks.list);
app.post('/bookmarks', bookmarks.add);
app.post('/bookmarks/folder', bookmarks.addFolder);
app.post('/bookmarks/edit/:bookId(\\d+)', bookmarks.edit);
app.post('/bookmarks/delete/:bookId(\\d+)', bookmarks.edit);
app.post('/bookmarks/import', bookmarks.import);
app.post('/bookmarks/insert', bookmarks.insert);
app.post('/bookmarks/insertFolder', bookmarks.insertFolder);
app.get('/bookmarks/create', bookmarks.create);
app.get('/bookmarks/favorite', bookmarks.favorite);
app.post('/bookmarks/editbookmark', bookmarks.editBookmark);
app.get('/bookmarks/editbookmark', bookmarks.editBookmark);
app.get('/bookmarks/upload-dialog', bookmarks.uploadDialog);
app.post('/bookmarks/upload', upload.single('csvFile'), bookmarks.parseFile);

app.listen(config.PORT, function () {
    console.log('Example app listening on port ' + config.PORT + '!');
});