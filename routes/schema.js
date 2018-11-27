// ./routes/schema.js
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var Posts  = new Schema({
    subject : String,
    body    : String
});

mongoose.connect('mongodb://localhost:27017/app1');

exports.Posts = mongoose.model('Posts', Posts);
