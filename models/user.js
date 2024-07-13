const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        require: true
    }
})
// User-name & password automaticaly generate kare mongoosh not need to difuned as aabove
// only pass 

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);