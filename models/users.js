// ./models/users.js
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema  = new Schema({
    username  : String,
    email     : String,
    password  : String
}, {timestamps: true});

// plugin passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// hook pre.save
// userSchema.pre('save', (next) => {
//   this.created_at = new Date(Date.now);
//   next();
// });

module.exports = mongoose.model('User', userSchema);
