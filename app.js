var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// user modules
var paginate = require('express-paginate');
// var http = require('http');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/app1");
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing the favicon.ico
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('port', process.env.PROT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// new lines
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
// end of insert
app.use(express.static(path.join(__dirname, 'public')));
app.use(paginate.middleware(5,10));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

//mongoose
// mongoose.connect('mongodb://localhost/app1');

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

// // server up for production
// http.createServer(app).listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
//   mongoose.connect('mongodb://localhost/app1');
// });

module.exports = app;
