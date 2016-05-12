/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

var config = require('../config');
var db     = require('../database/db');

/**
 *
 * Attempt to login the user.  Redirect to /books on successful login and /login on unsuccessful attempt.
 */
module.exports.login = function (req, res) {
    var un = req.body.username;
    var pw = req.body.password;

    console.info(`User login for ${un} with password ${pw}`);

    if (un != "" && pw != "")
    {
        db.query('SELECT password from Users WHERE username =  "' + un + '"', function (error, user) {
            console.info('Get user response ', user);
            if (error)
            {
                console.debug(error);
                throw err;
            }

            // if the user is in the database
            if (user != "")
            {
                var password = user[0].password;
                if (password == pw)
                {
                    console.log("Valid login");
                    req.session.user = req.body.username;
                    res.redirect('/bookmarks');
                }
                else
                {
                    res.redirect('/login');
                }
            }
            else
            {
                res.redirect('/login');
            }
        });
    }
    else
    {
        res.redirect('/login');
    }

};

/**
 * Render the login form
 */
module.exports.loginForm = function (req, res) {
    req.session.user = undefined;
    res.render('users/login');
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