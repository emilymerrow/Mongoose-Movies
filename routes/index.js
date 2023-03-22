var express = require('express');
var router = express.Router();
const passport = require('passport')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/movies')
});

// Google Oatuh login route
// this is the route the browser makes an http request to
// in order to start the oauth login process
router.get('/auth/google', passport.authenticate( // <- brings the client to Google Oauth Consent Screen for your app!
  'google',
  {
    scope: ['profile', 'email']
    // optionally force pick account every time, SOmetimes oauth remembers you logged in, 
    // if you don't want that
    // prompt: "select_account" <- add this key/value to this object
  }
))

// this route is where google redirects the client, back to our app, 
// then we decide where we want the user to go after they login
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/movies', // <- what route do you want the client to make a get request too if everything worked
    failureRedirect: '/movies' // where do you want the client to make a request to if they didn't login
  }
))


router.get('/logout', function(req, res){
  req.logout(function(){ // <- req.logout is from passport and it destorys the session cookie!, so now a new one is created
    // with no user._id inside of it, so we have no idea who the user is when a request is made to the server!
    res.redirect('/movies') // <- when the user logouts where do you want to go?
  })
})


module.exports = router;
