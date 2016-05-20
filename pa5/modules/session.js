var session = require('express-session');

module.exports = session(
    {
        secret: 'N0deJS1sAw3some',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false}
    }
);