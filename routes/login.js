// ./routes/login.js
var User = require('../models/users');

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
