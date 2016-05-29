var express = require('express');
var users    = require('../modules/users');
var router  = express.Router();

router.get('/login', users.loginForm);
router.get('/', users.loginForm);
router.get('/register', users.registerForm);
router.post('/register', users.register, users.getNewUser);
router.post('/login', users.login);
router.get('/logout', users.logout);

module.exports = router;
