require('dotenv').config(); // this line allows our node app to read from the .env file!
// process.env.VARIABLE_NAME, process.env.GOOGLE_CALLBACK or process.env.GOOGLE_SECRET
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const reviewsRouter = require('./routes/reviews');
const performersRouter = require('./routes/performers');

const app = express();

// require database file
// this will create a connection 
// from our server.js (localhost:3000) -> Mongodb localhost:27017
require('./config/database');
require('./config/passport'); // <- setups up passport functions
// Since we are not exporting anything from the database file, 
// no need to save it to a constiable


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
  secret: process.env.SECRET, // <- this is accessing the variable in the .env file
  resave: false,
  saveUninitialized: true
}));

// PASSPORT MUST BE ADDED AFTER THE SESSION, because it USES
// THE SESSION COOKIE TO STORE THE LOGGED IN USERS ID
app.use(passport.initialize()); // <- copy paste job from the docs
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/movies', moviesRouter);

// Embedded Resources (Reviews)
// One to many relationship
// are always mounted as just `/` 
// because none of the routes start with the same 
// common path like `/movies`
app.use('/', reviewsRouter);
app.use('/', performersRouter);

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

module.exports = app;
