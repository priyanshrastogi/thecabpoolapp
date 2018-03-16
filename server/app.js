//essentials
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
//route modules
var index = require('./routes/index');
var users = require('./routes/users');
var poolRequests = require('./routes/poolrequests');
var cabRequests = require('./routes/cabrequests');
var cabProviders = require('./routes/cabproviders');
var config = require('./config');

//mongodb handling
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = config.mongoUrl;
var connect = mongoose.connect(url, {
  useMongoClient: true
});
connect.then((db) => {
  console.log("Connected to database.");
}, (err) => { console.log(err) });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//logging
app.use(logger('dev'));

app.use(cors());
//parse body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//initialize passport 
app.use(passport.initialize());
app.use(passport.session());

//route middlewares
app.use('/', index);
app.use('/users', users);
app.use('/poolrequests', poolRequests);
app.use('/cabrequests', cabRequests);
app.use('/cabproviders', cabProviders);

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
