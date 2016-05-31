var config = require('../config');
var bcrypt = require('bcrypt');
var path   = require('path');
var Users  = require('../database/models').Users;

const saltRounds = 10;

module.exports.registerForm = function (req, res) {
    var error;
    if (req.body && req.query.message === 'userExists') {
        error = 'User name already exists please try a different user name.';
    }

    if (req.body && req.query.message === 'invalid') {
        error = 'Invalid user name or password.';
    }

    res.render('login', {action: 'Register', partialName: 'users/registration-form', error: error});
};

module.exports.forgotPassForm = function (req, res) {
    var error;
    if (req.body && req.query.message === 'noMatch') {
        error = 'Passwords given do not match. Please reenter new password.';
    }

    res.render('login', {action: 'Change Password', partialName: 'users/change-pass-form', error: error});
};

module.exports.changePassword = function(req, res) {
    var password = req.body.password;
    var confirm  = req.body.confirm;
    if (password !== confirm)
    {
        return res.redirect('/change-password?message=noMatch');
    }

    var userId = req.session.uid;
    if(!userId) {
        return res.redirect('/login?message=notLoggedIn');
    }

    var update = Users.update({password: password}, {where: {id: userId}});
    update.then(()=>res.redirect('/login?message=passChanged')).catch(()=>res.redirect('/login?message=notSure'));

};


module.exports.register = function (req, res, next) {
    var hasJavaScript = req.body.hasJavaScript !== 'false';
    var un            = req.body.username;
    var pw            = req.body.password;

    if (un == "" || pw == "")
    {
        return res.redirect('/register?message=invalid');
    }

    Users.create({name: un, password: pw}).then(function (qRes) {
        console.log(qRes);
        var user = qRes.dataValues;
        console.info('[register] Get user response ', user);
        if (!user)
        {
            console.error('[register] user not defined!');
            return res.redirect('/register?message=invalid');
        }

        req.session.uid  = user.id;
        req.session.user = req.body.username;

        if (!hasJavaScript)
        {
            return res.redirect('/bookmarks');
        }

        return res.sendFile(path.join(__dirname, '../assets/index.html'));

    }).catch(function (error) {
        console.error(error);
        res.redirect('/register?message=userExists');
    });
};

module.exports.getNewUser = function (req, res) {
    Users.find({where: {name: req.session.user}}).then(function (user) {
        if (!user)
        {
            console.error(error);
            return res.redirect('/register?message=userExists');
        }

        // req.session.uid = user.userId;
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
    var action        = req.body.action;

    console.info(`User login for ${un} with password ${pw}`);

    if (un == "" || pw == "")
    {
        return res.redirect('/login?message=invalid');
    }

    Users.find({where: {name: un}}).then(function (user) {

        if (!user)
        {
            console.error('[login] User not found');
            return res.redirect('/login?message=notFound');
        }

        if (bcrypt.compareSync(pw, user.password))
        {
            console.log('[login] Valid login');
            req.session.user = user.name;
            req.session.uid  = user.id;
            
            if (action === 'change-pass') {
                return res.redirect('/change-password');
            }

            if (!hasJavaScript)
            {
                return res.redirect('/bookmarks');
            }

            return res.sendFile(path.join(__dirname, '../assets/index.html'));

        }

        res.redirect('/login?message=invalid');

    }).catch(function (err) {
        return res.redirect('/login?message=notSure');
    });
};

/**
 * Render the login form
 */
module.exports.loginForm = function (req, res) {
    req.session.user = undefined;
    var error;
    if (req.body && req.query.message) {
        switch(req.query.message) {
            case 'notLoggedIn':
                error = 'You must be logged in to change your password';
                break;
            case 'passChanged':
                error = 'You successfully changed you password. Go ahead and try it out.';
                break;
            case 'invalid':
                error = 'The password/user name you entered are invalid.';
                break;
            case 'notFound':
                error = 'User not found.';
                break;
            case 'notSure':
                error = 'Not sure what happened... go ahead and try to login again.';
                break;
        }
    }

    res.render('login', {action: 'Login', partialName: 'users/login-form', error: error});
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
        if (req.url.match(/^\/api\/.*$/))
        {
            return res.status(401).json({message: 'Authentication required'})
        }

        res.redirect('/login');
    }
};