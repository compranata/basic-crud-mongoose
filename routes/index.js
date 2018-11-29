var express = require('express');
var router = express.Router();
var post = require('./post');
var paginate = require('express-paginate');

/* Routing */
router.get('/posts', post.search);
router.post('/posts/create', post.create);
router.get('/posts/search', post.search);
router.get('/posts/:id', post.search);
router.post('/posts/:id/upd', post.update);
router.post('/posts/:id/del', post.destroy);

/* 404 */
router.get('*', function(req, res, next) {
  res.send('Not found');
});

module.exports = router;
