//model is always capitalized, in every language
const MovieModel = require('../models/movie');
//MovieModel can perform Crud operations on the database
// Google Questions
// Query Methods for Mongoose Models? How .find(), `.findOne`, findOneAndUpdate
// create and object with a mongoose Model
// How to delete data(document) with a mongoose model
module.exports = {
	new: newMovie,
	create
}

function create(req, res){

	req.body.cast = req.body.cast.split(','); // changes, those strings into an array
	req.body.nowShowing = !!req.body.nowShowing;
	console.log(req.body, " <- contents of the form, req.body");

	// Asynchronous, The model, has to travel to talk to the database, 
	// database is one another port, so it takes times for this to happen
	MovieModel.create(req.body)
			  .then(function(movieWeCreatedInTheDb){
			
				// This function is the callback, to the create method, 
				// so this functions gets called after we get a response from the database
				// that we added the contents of the form (req.body) to the database
				console.log(movieWeCreatedInTheDb, " <- movie document")
				// Always respond to the client, in the cb function of the model
				// because we want to make sure the database performed its job before 
				// we respond to the client
				res.redirect('/movies'); // 404 because we haven't made the index route yet
		
			}).catch((err) => {
				console.log(err);
				res.send('There was an error check the terminal, or log the err object')
			})
	// I like to use res.send just to check if I'm able to make an 
	// http request to my POST, 
	// res.send('Hitting the Post Route, check the terminal for the contents of the form')

}

function newMovie(req, res){


	// Render looks in the views folder
	res.render('movies/new')
}