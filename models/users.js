// ./models/users.js
const mongoose    = require('mongoose')
const Schema      = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema  = new Schema({
  username  : String,
  email     : String,
  password  : String,
  active    : Boolean,
  role     : String
}, {timestamps: true})

// plugin passport-local-mongoose
userSchema.plugin(passportLocalMongoose)

// hook pre.save
// userSchema.pre('save', (next) => {
//   this.created_at = new Date(Date.now);
//   next();
// });

module.exports = mongoose.model('User', userSchema)
