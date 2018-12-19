// ./routes/index.js

var express = require('express');
var app = express();
var config = require('../config')[app.get('env')];
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var Mdb = require('../modules/db-crud');
var auth = require('../modules/db-auth');
const {check, body, validationResult} = require('express-validator/check');

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
router.post('/register', [
  check('username').isLength({min: 3}).withMessage('Username must be at least 3 characters'),
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').not().isEmpty().withMessage('Password cannot be empty'),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
  })
  // eqauls('confirm', 'password').withMessage('password does not match')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var invalid = errors.array();
    var indexField = ['username', 'email', 'password', 'confirm'];
    var rtn = [{},{},{},{}];
    for (var i = 0; i < invalid.length; i++) {
      indexField.forEach(function(val, idx) {
        if (invalid[i].param === val) {
          rtn[idx] = invalid[i]
        }
      });
    }
    // return res.status(422).json({errors: errors.array()});
    return res.render('users/register', {user: req.body, invalid: rtn});
  }
  // if (req.body.password !== req.body.confirm) {
  //   return res.render('users/register', {error: {message: 'Repeated password is not matched with your password'}});
  // }
  auth.register(req, res);
});

/* Login-out profile */
router.get('/login', function(req, res) {
  auth.login(req, res, function(err, result) {
    res.render('users/login', result);
  });
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureMessage: true,
  failureRedirect: '/login'
}));
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
