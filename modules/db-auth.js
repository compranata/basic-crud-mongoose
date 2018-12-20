// ./routes/users.js
var User = require('../models/users');
var debug = require('debug')('register');

// exports.mail = function(req, res) {
//   var nodemailer = require('nodemailer');
//   var transport = nodemailer.createTransport();
//
//   transport.sendMail({
//     from    : 'No-Reply',
//     to      : 'compranata@gmail.com',
//     cc      : 'admin',
//     subject : 'Authentication',
//     text    : 'Authenticate your email'
//   });
// };

exports.register = function(req, res) {
  var newUser = new User({
    username    : req.body.username,
    email       : req.body.email,
    active      : true,
    group       : 'editor'
  });
  debug('newUser =  %O', newUser);
  User.register(newUser, req.body.password, function (err, user) {
    // this err is for register err, as username already exists, username is not given etc
    if (err) return res.render('users/register', {user: {username: req.body.username, email: req.body.email}, error: err});
    debug('user = %O', user);
    User.authenticate('local')(req.body.username, req.body.password, function(err, result) {
      debug('result = %O', result);
      // this err is for db server error etc
      if (err) throw err;
      res.render('users/login', {user: result, message: 'Please reconfirm your password'});
    });
  });
};

exports.login = function(req, res, cb) {
  var header = req.headers.referer || 'boo';
  var fromLogin = (/^https?:\/{2,}.*?\/.*\/?login$/).test(header);
  if (fromLogin) {
    const message = req.session.messages[req.session.messages.length - 1];
    cb(null, {user: req.user, message: message});
  } else {
    cb(null, {user: req.user});
  }
};
