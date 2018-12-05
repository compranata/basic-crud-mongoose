// ./routes/index.js

var express = require('express');
var router = express.Router();
var post = require('./post');
var passport = require('passport');
var login = require('./login');
var User = require('../models/users');

/* Routing */
router.get('/', login.index);
router.get('/register', login.register);
router.post('/register', login.create);
router.get('/login', login.login);
router.post('/login', passport.authenticate('local'), login.auth);
router.get('/logout', login.logout);
router.get('/posts', post.search);
router.post('/posts/create', post.create);
router.get('/posts/search', post.search);
router.get('/posts/:id', post.search);
router.post('/posts/:id/upd', post.update);
router.post('/posts/:id/del', post.destroy);

/* 404 */
router.get('*', function(req, res, next) {
  var err = new Error('the page your requested not exist');
  err.status = 404;
  next(err);
});

module.exports = router;
