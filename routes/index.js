var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Benjamin Goegge - Startup Services', description: 'Services to support startups' });
});

router.get('/signup', function(req, res) {
    res.render('signup', { });
});

//TODO: Throw it in model.
router.post('/signup', function(req, res) {
    User.register(new User({ username : req.body.username || req.body.email, name: req.body.name, photo: req.body.photo, email: req.body.email, phone : req.body.phone }), req.body.password, function(err, account) {
        if (err) {
            return res.render('signup', { user : req.user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.email' }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/auth/twitter',
  passport.authenticate('twitter'));
router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.get('/ping', function(req, res){
    if (req.isAuthenticated()) {
        res.status(200).send("pong!");
    } else {
        res.status(200).send("no pong!");
    }
});

module.exports = router;
