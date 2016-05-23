var config = require('../config');
var bcrypt = require('bcrypt');
var path   = require('path');
var Users  = require('../database/models').Users;
const saltRounds = 10;

module.exports.registerForm = function (req, res) {
    res.render('login', {action: 'Register', partialName: 'users/registration-form', error: req.reportedError});
};

module.exports.register = function (req, res, next) {
    var un           = req.body.username;
    var pw           = req.body.password;
    // var salt         = bcrypt.genSaltSync(saltRounds);
    // var hashed_pw    = bcrypt.hashSync(pw, salt);

    if (un == "" || pw == "")
    {
        return res.redirect('/register');
    }

    Users.create({name: un, password: pw}).then(function (qRes) {
        console.log(qRes);
        var user = qRes.dataValues;
        console.info('[register] Get user response ', user);
        if (!user)
        {
            console.error('[register] user not defined!');
            return res.redirect('/register');
        }
        req.session.user = req.body.username;
        return res.redirect('/login');
    }).catch(function (error) {
        console.error(error);
        res.redirect('/register');
    });
};

module.exports.getNewUser = function (req, res) {
    Users.find({where: {name: req.session.user}}).then(function (user) {
        if (!user)
        {
            console.error(error);
            return res.redirect('/register');
        }

        req.session.uid = user.id;
        res.redirect('/bookmarks');
    });
};

/**
 *
 * Attempt to login the user.
 */
module.exports.login = function (req, res) {
    var un            = req.body.username;
    var pw            = req.body.password;
    var hasJavaScript = req.body.hasJavaScript !== 'false';

    console.info(`User login for ${un} with password ${pw}`);

    if (un == "" || pw == "")
    {
        return res.redirect('/login');
    }

    Users.find({where: {name: un}}).then(function (user) {

        if (!user)
        {
            console.error('[login] User not found');
            return res.redirect('/login');
        }

        if (bcrypt.compareSync(pw, user.password))
        {
            console.log('[login] Valid login');
            req.session.user = user.name;
            req.session.uid  = user.id;

            if (!hasJavaScript)
            {
                return res.redirect('/bookmarks');
            }

            return res.sendFile(path.join(__dirname, '../assets/index.html'));

        }

        res.redirect('/login');

    }).catch(function (err) {
        console.log(err);
    });
};

/**
 * Render the login form
 */
module.exports.loginForm = function (req, res) {
    req.session.user = undefined;
    res.render('login', {action: 'Login', partialName: 'users/login-form', error: req.reportedError});
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
    if (req.session.user)
    {
        return next();
    }
    else
    {
        if (req.url.match(/^\/api\/.*$/)) {
            return res.status(401).json({message: 'Authentication required'})
        }

        res.redirect('/login');
    }
};