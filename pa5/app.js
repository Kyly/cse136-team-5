var express      = require('express');
var compression  = require('compression');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var handlebars = require('./modules/handlebars');
var session    = require('./modules/session');
var auth       = require('./modules/users').auth;
var users      = require('./routes/users');
var bookmarks  = require('./routes/bookmarks');
var api        = require('./routes/bookmarks.api');
var db         = require('./database/db');
db.init();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/assets/img/favicon.ico'));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(session);

app.use('/', users);
app.use(auth);
app.use('/bookmarks', bookmarks);
app.use('/api/bookmarks', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.disable('x-powered-by');

module.exports = app;
