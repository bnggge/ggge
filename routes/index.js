var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('index', { user : req.user });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { });
});

//TODO: Throw it in model.
router.post('/signup', function(req, res, next) {
    User.register(new User({ username : req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone : req.body.phone }), req.body.password, function(err, account) {
        if (err) {
            return res.render('signup', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.redirect('/');
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res, next){
    res.status(200).send("pong!");
});

module.exports = router;
