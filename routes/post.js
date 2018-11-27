// ./routs/post.js

// connetion to db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app1');
var model = require('./schema');
var Posts = model.Posts;
// var uuidv4 = require('uuid/v4');

// exports methods

// router.get('/posts', post.index);
exports.index = function (req, res) {
  Posts.find(function (err, posts) {
    if (err) throw err;
    res.render('posts/index', {posts:posts});
  });
};

// router.get('/posts/new', post.new);
exports.new = function (req, res) {
  res.render('posts/new');
};

// router.post('/posts/create', post.create);
exports.create = function (req, res) {
  var post = new Posts();
  // Add unique id instead of _id ObjectId
  // var uid  = uuidv4();
  // post = {
  //   subject: req.body.subject,
  //   body: req.body.body
  // };
  // post.id = uid;

  post.subject = req.body.subject;
  post.body = req.body.body;

  post.save(function(err){
    if (err) throw err;
  });
  res.redirect('/posts');
};

// router.get('/posts/:id', post.show);
exports.show = function (req, res) {
  Posts.findOne({_id: req.params.id}, function(err, item) {
    res.render('posts/show', {post:item});
  });
};

// router.get('/posts/:id/edit', post.edit);
exports.edit = function (req, res) {
  Posts.findOne({_id: req.params.id}, function(err, item) {
    res.render('posts/edit', {post:item});
  });
};

// router.put('/posts/:id', post.update);
exports.update = function (req, res) {
  var updated = new Posts();
  updated = req.body;
  Posts.update({_id: updated.id}, updated, function(err) {
    if (err) throw err;
  });
  res.redirect('/posts');
};

// router.delete('/posts/:id', post.update);
exports.destroy = function (req, res) {

  Posts.remove({_id: req.body._id}, function(err) {
    if (err) throw err;
  });
  res.redirect('/posts');
};

// router.get('/posts/search', post.search);
exports.search = function (req, res) {
  const MAX_ITEMS_PER_PAGE = 3;
  const query = req.query.q;
  const page = req.query.pg ? parseInt(req.query.pg) : 1;

  // if keyword is empty, redirect to index
  if (!req.query.q) {
    res.redirect('/posts');
  }
  // Search box if multiple words spared with space, create regexp with |
  let keys = (req.query.q).split(/\s/).join('|');
  // find() in subject or in body
  const filter = {$or: [{subject: new RegExp(`.*${keys}.*`, 'i')},
      {body: new RegExp(`.*${keys}.*`, 'i')}]};
  Posts.count(filter).then((count) => {
    Posts.find(filter, function(err, results) {
      if (err) throw err;
      res.render('posts/results', {count: count, keys: keys, posts: results});
    });
  });

  // Promise.all([
  //   Posts.find(
  //     {$or: [{subject: new RegExp(`.*${keys}.*`, 'i')},
  //       {body: new RegExp(`.*${keys}.*`, 'i')}]}
  //   ).count(),
  //   Posts.find(
  //     {$or: [{subject: new RegExp(`.*${keys}.*`, 'i')},
  //       {body: new RegExp(`.*${keys}.*`, 'i')}]}
  //   ).skip((page - 1) * MAX_ITEMS_PER_PAGE).toArray()
  // ]).then((results) => {
  //   var data = {
  //     keys: keys,
  //     count: results[0],
  //     posts: results[1],
  //     pagination: {
  //       max: Math.ceil(results[0] / MAX_ITEMS_PER_PAGE),
  //       current: page,
  //       isFirst: page === 1,
  //       isLast:  page === Math.ceil(results[0] / MAX_ITEMS_PER_PAGE)
  //     },
  //     query: query
  //   };
  //   res.render('posts/results', data);
  // });
  // Posts.find(
  //   {$or: [{subject: new RegExp(`.*${keys}.*`, 'i')},
  //     {body: new RegExp(`.*${keys}.*`, 'i')}]},
  //   function(err, results) {
  //     if (err) throw err;
  //     // res.render('posts/results', {keys: keys, posts: results});
  // });

};
