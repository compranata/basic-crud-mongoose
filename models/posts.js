// ./models/posts.js
const mongoose    = require('mongoose')
const Schema     = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const userSchema  = new Schema({
  subject : String,
  body    : String,
  html    : String,
  user_id : String,
  active  : Boolean
}, {timestamps: true})

// plugin mongoose-paginate
userSchema.plugin(mongoosePaginate)

exports.Post = mongoose.model('Post', userSchema)
