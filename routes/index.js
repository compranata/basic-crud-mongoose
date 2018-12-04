// ./routes/index.js

var express = require('express');
var router = express.Router();
var post = require('./post');

/* Routing */
router.get('/posts', post.search);
router.post('/posts/create', post.create);
router.get('/posts/search', post.search);
router.get('/posts/:id', post.search);
router.post('/posts/:id/upd', post.update);
router.post('/posts/:id/del', post.destroy);

/* 404 */
router.get('*', function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;
