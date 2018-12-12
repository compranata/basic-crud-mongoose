// ./routes/index.js

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Mdb = require('../modules/db-crud');

/* Routing  index */
router.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/posts');
  } else {
    res.render('index', {user: req.user});
  };
});

/* Register */
router.get('/register', function(req, res) {
  res.render('users/register', {});
});
router.post('/register', function(req, res) {
  User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user) {
    if (err) return res.render('users/register', {error: err});
    User.authenticate('local')(req.body.username, req.body.password, function(err, result){
      if (err) throw err;
      res.render('users/login', {user: result, message: 'Please reconfirm your password'});
    });
  });
});

/* Login-out profile */
router.get('/login', function(req, res) {
  res.render('users/login', {user: req.user});
});
router.get('/login/err', function(req, res) {
  const message = req.session.messages[req.session.messages.length - 1];
  console.log(message);
  res.render('users/login', {user: req.user, message: message});
});
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureMessage: true,
//   failureRedirect: '/login/err'
// }));
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/profile', function(req, res) {
  if (!req.user) res.redirect('/');
  res.render('users/profile', {user: req.user});
});
router.post('/profile', function(req, res) {
  res.send('password change');
});

/* app */
router.get('/posts', function(req, res) {
  var mdb = new Mdb(req);
  mdb.search(req, res, (err, result) => {
    if (err) throw err;
    console.log(req.user);
    res.render('posts/boards', result);
  });
});
router.post('/posts/create', function(req, res) {
  var mdb = new Mdb(req);
  mdb.save(req, res, (err, result) => {
    res.redirect('/posts/' + result._id);
  });
});
router.get('/posts/:id', function(req, res) {
  var mdb = new Mdb(req);
  mdb.search(req, res, (err, result) => {
    res.render('posts/boards', result);
  });
});
router.post('/posts/:id/upd', function(req, res) {
  var mdb = new Mdb(req);
  mdb.update(req, res);
  res.redirect('/posts/' + req.body._id);
});
router.post('/posts/:id/del', function(req, res) {
  var mdb = new Mdb(req);
  mdb.destroy(req, res);
  res.redirect('/posts');
});

/* 404 */
router.get('*', function(req, res, next) {
  var err = new Error('the page your requested not exist');
  err.status = 404;
  next(err);
});

module.exports = router;
