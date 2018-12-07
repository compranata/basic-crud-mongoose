// ./app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// modules for DB
var mongoose = require('mongoose');
// <<<< the options put into config for production >>>>
mongoose.connect("mongodb://localhost/app1");

// modulbes for Pagination
var paginate = require('express-paginate');

// modules for passport authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);

// Routing setup files
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing the favicon.ico
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Pagination
app.use(paginate.middleware(5,10));
// Authentication
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 24 * 60 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routing setup
app.use('/', indexRouter);

// passport config
var User = require('./models/users');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals = {
    user: req.user
  };
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('error' + req);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// // web server
// http.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
//   mongoose.connect('mongodb://localhost/app1');
// });

module.exports = app;
