// ./models/posts.js
var mongoose    = require('mongoose');
var Schema     = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var userSchema  = new Schema({
    subject : String,
    body    : String
});

// plugin mongoose-paginate
userSchema.plugin(mongoosePaginate);

exports.Post = mongoose.model('Post', userSchema);
