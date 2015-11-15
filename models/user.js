var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

var User = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    phone: String,
    email: String
});

User.plugin(passportLocalMongoose);
User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);

