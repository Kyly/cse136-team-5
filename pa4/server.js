var db              = require('./database/db');
var config          = require('./config');
var bookmarks       = require('./controllers/bookmarks');
var users           = require('./controllers/users');
var express         = require('express');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var handlebars      = require('express-handlebars');
var path            = require('path');
var errorhandler    = require('errorhandler');
var morgan          = require('morgan');

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
app.engine('handlebars',
           handlebars({
                          helpers: {
                              toJSON: function (object) {
                                  return JSON.stringify(object);
                              }
                          }
                      }
           )
);

app.set('view engine', 'handlebars');
// FIXME app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
// app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({extended: true}));

/* Error handler set up*/
app.use(errorhandler({log: false}));
/* Logging set up */
app.use(morgan('common'));

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
app.get('/bookmarks/edit/:book_id(\\d+)', bookmarks.list);
app.get('/bookmarks/confirmdelete/:book_id(\\d+)', bookmarks.confirmdelete);
app.get('/bookmarks/delete/:book_id(\\d+)', bookmarks.delete);
app.post('/bookmarks/update/:book_id(\\d+)', bookmarks.update);
app.post('/bookmarks/insert', bookmarks.insert);

app.listen(config.PORT, function () {
    console.log('Example app listening on port ' + config.PORT + '!');
});

