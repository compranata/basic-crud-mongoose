// ./routes/posts.js
var model = require('../models/posts');
// var db = require('../modules/db-crud');
var Post = model.Post;
var paginate = require('express-paginate');

// exports methods for posts

// router.post('/posts/create', post.create);
exports.create = function (req, res) {
  var post = new Post();
  // need validation methods
  post.subject = req.body.subject;
  post.body = req.body.body;

  // db.save(post);
  post.save(function(err){
    if (err) throw err;
  });
  res.redirect('/posts/' + post._id);
};

// router.put('/posts/:id', post.update);
exports.update = function (req, res) {
  var updated = new Post();
  updated = req.body;
  Post.updateOne({_id: updated.id}, updated, function(err) {
    if (err) throw err;
  });
  res.redirect('/posts/' + updated.id);
};

// router.delete('/posts/:id', post.update);
exports.destroy = function (req, res) {
  Post.remove({_id: req.body._id}, function(err) {
    if (err) throw err;
  });
  res.redirect('/posts');
};

// router.get('/posts', post.search);
// router.get('/posts/:id', post.search);
// router.get('/posts/search', post.search);
exports.search = function (req, res) {
  // if (!req.user) res.redirect('/');
  var keys = '';
  var filter = {};
  var resultType = '';

  if (req.query.q) {
    // Search box if multiple words spared with space, create regexp with |
    let keywords = (req.query.q).split(/\s/).join('|');
    keys = req.query.q;
    // find() in subject or in body
    filter = {$or: [{subject: new RegExp(`.*${keywords }.*`, 'i')},
    {body: new RegExp(`.*${keywords }.*`, 'i')}]};
    resultType = "Search Results";
  }

  // if reached this template from router posts/:id = details screen
  if (req.params.id) {
    filter = {_id: req.params.id};
    resultType = "Details";
  }

  Post.paginate(filter, {page: req.query.page, limit: req.query.limit}, function(err, result) {
    if (err) throw err;
    res.render('posts/results', {
      title: resultType,
      keys: keys,
      totalHit: result.total,
      posts: result.docs,
      currentPage: result.page,
      pageCount: result.pages,
      pages: paginate.getArrayPages(req)(5, result.pages, req.query.page),
      user: req.user,
      urlstr0: '?page=1&limit=' + result.limit,
      urlstr1: '?page=' + result.pages + '&limit=' + result.limit
    });
  });
};
