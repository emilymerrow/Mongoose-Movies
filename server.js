require('dotenv').config(); // this line allows our node app to read from the .env file!
// process.env.VARIABLE_NAME, process.env.GOOGLE_CALLBACK or process.env.GOOGLE_SECRET
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

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

// The point of the sessions cookie is so we can keep track of what client is making 
// http requests to the server 
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
app.use(methodOverride('_method')); // <- this needs to be added for PUT And DELETE request that are in the 
// query strings from the client http requests /?_method=DELETE

// this custom middlware needs to be after passport!
// =================================================
// =================================================
// =================================================
// THIS code means you never have to pass req.user in your controller functions in the render!
// to inject user into the your ejs template
// THis is super useful project so Read these comments!
app.use(function(req, res, next){
  res.locals.user = req.user;  // req.user, is from the cleint
  // it will be a user document or undefined (not logged in)

  // res.locals, is an object that is passed into EVERY SINGLE EJS PAGE IN YOUR VIEWS FOLDER
  // and it will pass a user object into it which will be the user document or undefined (if not logged in)
  // whatever key you attach to res.locals is avialable in every ejs file!
  next()
})
// =================================================
// =================================================
// =================================================


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
