var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');
var config = require('./config/config');
mongoose.connect(config.db.uri);
var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var User = require('./models/user');
passport.use(User.createStrategy());
passport.use(new GoogleStrategy({
    clientID: config.auth.google.id,
    clientSecret: config.auth.google.secret,
    callbackURL: "http://ggge.eu/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ email: profile.emails[0].value, photo: profile.photos[0].value, name: profile.displayName, googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.id,
    clientSecret: config.auth.facebook.secret,
    callbackURL: "http://ggge.eu/auth/facebook/callback",
    profileFields: ['id', 'email', 'picture', 'name', 'displayName'],
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ email: profile.emails[0].value, photo: profile.photos[0].value, name: profile.displayName, facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
passport.use(new TwitterStrategy({
    consumerKey: config.auth.twitter.key,
    consumerSecret: config.auth.twitter.secret,
    callbackURL: "http://ggge.eu/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    User.findOrCreate({ username: profile.username, photo: profile.photos[0].value, name: profile.displayName, twitterId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
