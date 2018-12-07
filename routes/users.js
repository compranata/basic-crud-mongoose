// ./routes/users.js
var passport = require('passport');
var User = require('../models/users');


// router.get('/profile', users.show);
exports.show = function(req, res) {
  if (!req.user) res.redirect('/');
  console.log(req.user);
  res.render('users/profile', {user: req.user});
};
