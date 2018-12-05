// ./routes/posts.js
var mongoose    = require('mongoose');
var Posts     = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var userSchema  = new Posts({
    subject : String,
    body    : String
}, {collection: 'posts'});

userSchema.plugin(mongoosePaginate);

// mongoose.connect('mongodb://localhost:27017/app1');

exports.Posts = mongoose.model('Posts', userSchema);
