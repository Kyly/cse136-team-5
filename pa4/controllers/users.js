/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

var config = require('../config');
var db     = require('../database/db');
var bcrypt = require('bcrypt');

module.exports.registerForm = function (req, res) {
    res.render('users/register', {error: req.reportedError});
};

module.exports.register = function (req, res) {
    var un = req.body.username;
    var pw = req.body.password;
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hashed_pw = bcrypt.hashSync(pw, salt);

    console.info(`Registering user ${un} with password ${pw}`);

    if (un == "" || pw == "")
    {
        return res.redirect('/register');
    }

    db.connection.query("INSERT INTO Users (username, password) VALUES (?, ?)", [un, hashed_pw], function (error, user) {
        console.info('Get user response ', user);
        if (error)
        {
            console.error(error);
            res.redirect('/register');
        }
        console.info('Successful registration. Logging user in');
        req.session.user = req.body.username;
        return res.redirect('/bookmarks');
    });
};
/**
 *
 * Attempt to login the user.
 */
module.exports.login = function (req, res) {
    var un = req.body.username;
    var pw = req.body.password;

    console.info(`User login for ${un} with password ${pw}`);

    if (un == "" || pw == "")
    {
        return res.redirect('/login');
    }

    db.connection.query("SELECT password, id FROM Users WHERE username = ?", [un],  function (error, user) {
        console.info('Get user response ', user);

        if (error)
        {
            console.error(error);
            return res.redirect('/login');
        }


        if (!user[0]) {
            console.error(`User ${un} not found`);
            return res.redirect('/login');
        }


        if (user.length == 1 && bcrypt.compareSync(pw, user[0].password))

        {
            console.log("Valid login");
            req.session.user = req.body.username;
            req.session.uid = user[0].id;
            return res.redirect('/bookmarks');
        }

        return res.redirect('/login');
    });
};

/**
 * Render the login form
 */
module.exports.loginForm = function (req, res) {
    req.session.user = undefined;
    res.render('users/login', {error: req.reportedError});
};

/**
 * Clear out the session to logout the user
 */
module.exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/login');
};

/**
 * Verify a user is logged in.  This middleware will be called before every request to the books directory.
 */
module.exports.auth = function (req, res, next) {
    /*
     if (req.session && req.session.user === config.USERNAME) {
     return next();
     }
     */

    if (req.session.user)
    {
        return next();
    }
    else
    {
        res.redirect('/login');
    }
};