// ./routes/index.js

var express = require('express');
var router = express.Router();
var passport = require('passport');
var register = require('./register');
var login = require('./login');
var post = require('./posts');

/* Routing */
router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/posts');
  } else {
    res.render('index', {user: req.user});
  };
});
router.get('/register', register.register);
router.post('/register', register.create);
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
