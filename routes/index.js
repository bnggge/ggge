var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var Page = require('../models/page');
var mongoose = require('mongoose');

router.use(function(req, res, next){
     if (req.hostname == 'ggge.de') { 
         res.locals.language = 'de';
         if (req.acceptsLanguages('en') && !req.acceptsLanguages('de')){
             res.locals.recommendedLocale = 'en';
         }
     } else if (req.hostname == 'ggge.eu') {
         res.locals.language = 'en';
         if (req.acceptsLanguages('de') && !req.acceptsLanguages('en')){
             res.locals.recommendedLocale = 'de';
         }
     } else {
         console.log('Could not resolve hostname:'+req.hostname);
     }
     next();
});

router.get('/', function (req, res) {
    res.render('index', { page: req.app.locals.site.index, locals: res.locals });
});

router.get('/impr(int)?(essum)?', function (req, res) {
    res.render('imprint', { page: req.app.locals.site.imprint, locals: res.locals });
});

router.get('/new', function(req, res) {
    if (req.isAuthenticated()) {
        res.render('new', {});
    } else {
        res.redirect('/signup');
    }});


router.post('/new', function(req, res) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        Page.create({ 
            en: req.body.en,
            de: req.body.de,
            images: req.body.images,
            attachments: req.body.attachments,
            thumbnail: req.body.thumbnail,
            author: mongoose.mongo.ObjectId(req.user._id), 
            status: req.body.status, 
            nav: req.body.nav, 
            template: req.body.template, 
            parent : req.body.parent,
            type: req.body.type }), 
        function(err, page) {
            if (err) res.redirect('/new');
            req.app.locals.pages.push(page);
        }} else {
            res.redirect('/signup');
        }});

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
    next();
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
        res.status(200).set('Cache-Control', 'private, max-age=600000').json(req.accepts('json'));
    } else {
        if (req.hostname == 'ggge.de') { 
            res.status(200).send("Kein Pong!");
        } else if (req.hostname == 'ggge.eu') {
            res.status(200).send("No pong!");
        } else {
            res.status(200).send("?? pong!");
        }
    }
});

module.exports = router;
