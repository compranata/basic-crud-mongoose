// ./routes/posts.js
var model = require('../models/posts');
var db = require('../modules/db-crud');
var Post = model.Post;
var paginate = require('express-paginate');

// exports methods for posts

// router.post('/posts/create', post.create);
exports.create = function (req, res) {
  if (!req.user) res.redirect('/posts');
  var post = new Post();
  // need validation methods
  post.subject = req.body.subject;
  post.body = req.body.body;
  db.save(post);
  res.redirect('/posts/' + post._id);
};

// router.put('/posts/:id', post.update);
exports.update = function (req, res) {
  if (!req.user) res.redirect('/posts');
  var updated = new Post();
  updated = req.body;
  db.update(updated);
  res.redirect('/posts/' + updated._id);
};

// router.delete('/posts/:id', post.update);
exports.destroy = function (req, res) {
  if (!req.user) res.redirect('/posts');
  db.destroy(req.body);
  res.redirect('/posts');
};

// router.get('/posts', post.search);
// router.get('/posts/:id', post.search);
// router.get('/posts/search', post.search);
exports.search = function (req, res) {
  db.search(req.query, req.params, (response) => {
    res.render('posts/boards', {
      title: response.resultType,
      originalQuery: (req.query.q) ? req.query.q : '',
      totalHit: response.result.total,
      posts: response.result.docs,
      currentPage: response.result.page,
      pageCount: response.result.pages,
      pages: paginate.getArrayPages(req)(5, response.result.pages, req.query.page),
      user: req.user,
      urlstr0: '?page=1&limit=' + response.result.limit,
      urlstr1: '?page=' + response.result.pages + '&limit=' + response.result.limit
    });
  });
};
