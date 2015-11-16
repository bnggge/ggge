var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

var User = new Schema({
    username: String,
    name: String,
    photo: String,
    password: String,
    phone: String,
    email: String,
    twitterId: String,
    facebookId: String,
    googleId: String
});

User.plugin(passportLocalMongoose, {usernameField: 'username', usernameQueryFields: ['email', 'twitterId', 'facebookId', 'googleId']});
User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);

