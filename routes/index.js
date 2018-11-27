var express = require('express');
var router = express.Router();
var post = require('./post');

/* Routing */
router.get('/posts', post.index);
router.get('/posts/new', post.new);
router.post('/posts/create', post.create);
router.get('/posts/search', post.search);
router.get('/posts/:id', post.show);
router.get('/posts/:id/edit', post.edit);
router.post('/posts/:id/upd', post.update);
router.post('/posts/:id/del', post.destroy);

module.exports = router;
