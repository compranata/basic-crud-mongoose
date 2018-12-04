// ./routes/posts.js
var mongoose    = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Posts     = mongoose.Schema;

var userSchema  = new Posts({
    subject : String,
    body    : String
});

userSchema.plugin(mongoosePaginate);

mongoose.connect('mongodb://localhost:27017/app1');

exports.Posts = mongoose.model('Posts', userSchema);
