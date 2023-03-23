

module.exports = function isLoggedIn(req, res, next){

	// is the user authenticated?, using passport
	// checking to see if the user is logged in!
	if(req.isAuthenticated()) return next(); // proceed to the controller function!
	// tell the user to loggin
	res.redirect('/auth/google')
}