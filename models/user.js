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
    email: { type: String, unique: true },
    twitterId: { type: String, unique: true },
    facebookId: { type: String, unique: true },
    googleId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

User.plugin(passportLocalMongoose, {usernameField: 'username', usernameQueryFields: ['email', 'twitterId', 'facebookId', 'googleId'], usernameLowerCase: true});
User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);

