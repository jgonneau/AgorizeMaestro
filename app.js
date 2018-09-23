var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//recuperation des routes
var routes = require('./src/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: '1578043278',resave:false,saveUninitialized:false, cookie: { maxAge: 60000 }}));

//routes
app.get('/', routes.index);
app.get('/connexion', routes.connexion);
app.get('/inscription', routes.inscription);
app.get('/dashboard', routes.dashboard);
app.post('/registration', routes.registration);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
