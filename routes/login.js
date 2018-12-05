// ./routes/login.js

// connetion to db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app1');
var passport = require('passport');
var User = require('../models/users');
// var User = model.User;


// router.get('/', login.index);
exports.index = function(req, res) {
  console.log('req.user: ' + req.user);
  if (req.user) {
    res.redirect('/posts');
  } else {
    res.render('index', {user: req.user});
  };
};

// router.get('/register', login.register);
exports.register = function(req, res) {
  res.render('register', {});
};

// router.post('/register', login.create);
exports.create = function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) return res.render('register', {user: user});
    User.authenticate('local')(req, res, function(){
      res.redirect('/');
    });
  });
};

// router.get('/login', login.login);
exports.login = function(req, res) {
  res.render('login', {user: req.user});
};

// router.post('/login', login.auth);
exports.auth = function(req, res) {
  res.redirect('/');
};

// router.get('/logout', login.logout);
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
