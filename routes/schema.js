// ./routes/schema.js
var mongoose    = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema      = mongoose.Schema;

var userSchema  = new Schema({
    subject : String,
    body    : String
});

userSchema.plugin(mongoosePaginate);

mongoose.connect('mongodb://localhost:27017/app1');

exports.Posts = mongoose.model('Posts', userSchema);
