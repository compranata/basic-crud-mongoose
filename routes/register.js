// ./routes/register.js
var passport = require('passport');
var User = require('../models/users');


// router.get('/register', login.register);
exports.register = function(req, res) {
  res.render('users/register', {});
};

// router.post('/register', login.create);
exports.create = function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) return res.render('users/register', {user: user});
    User.authenticate('local')(req, res, function(){
      res.redirect('/users/login');
    });
  });
};
