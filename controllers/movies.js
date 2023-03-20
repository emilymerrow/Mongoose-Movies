//model is always capitalized, in every language
const MovieModel = require('../models/movie');
// import the PerformerModel 
const PerformerModel = require('../models/performer');
//MovieModel can perform Crud operations on the database
// Google Questions
// Query Methods for Mongoose Models? How .find(), `.findOne`, findOneAndUpdate
// How can I find all of a resource using a mongoose model c(r)ud
// How can I update a resource using a mongoose model? cr(u)d
// How can I delete a resource using a mongoose model cru(d)
// How can I create a resource using a mongoose model (c)rud
// create and object with a mongoose Model
// How to delete data(document) with a mongoose model
module.exports = {
	new: newMovie,
	
	create,
	index,
	show
}








function show(req, res) {
	
	MovieModel.findById(req.params.id)
			  .then(function(movieDoc){
				console.log(movieDoc) // <- movieDoc is the object from the database!

				// Goal: TO find all of the Performers that are not in the movies cast array
				// 1. find the movie (movieDoc) so we know what performers are in the cast array
				// 2. Use the PerformerModel to query the performers collection to find all the performers
				// whose id is not in the movieDoc.cast array
				PerformerModel.find(
					{_id: {$nin: movieDoc.cast}} // find all the performers that are not in ($nin) the movieDoc.cast array
				).then(function(performersNotInMovie){
					res.render('movies/show', { 
						movie: movieDoc, // this has the cast array, the performers in the movie
						performersNotInMovie // this is for our dropdown menu
					});
				})



				
			  }).catch((err) =>{
				console.log(err);
				res.send(err)
			  })
  }

function index(req, res){

	//  the empty object {} is called a
	// query object, mongoose
	MovieModel.find({})
	// MovieModel.find is our mongoose model going to mongodb
	// to find all the movies in the movies collection
	// when the model comes back from the database
	// we want a function to run
	// that is the .then
			  .then(function(allMovies){

				console.log(allMovies, " <_ data from the db")
				// respond to the client in the .then, we have to wait 
				// for the data to come back from the database
				res.render('movies/index', {movies: allMovies})
			  }).catch(function(err){
				console.log(err);
				res.send(err)
			  })

	
}

function create(req, res){

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
				res.redirect(`/movies/${movieWeCreatedInTheDb._id}`); // 404 because we haven't made the index route yet
		
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