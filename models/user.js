var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

var User = new Schema({
    username: { type: String, unique: true },
    fullname: String,
    photo: String,
    password: String,
    phone: String,
    email: { type: String, index: true },
    twitterId: { type: String },
    facebookId: { type: String },
    googleId: { type: String },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

User.plugin(passportLocalMongoose, {usernameField: 'username', usernameQueryFields: ['email', 'twitterId', 'facebookId', 'googleId'], usernameLowerCase: true});
User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);

