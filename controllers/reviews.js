// import our movie Model so we can find the movie we want to add a review too
const MovieModel = require('../models/movie');

module.exports = {
	create
}

function create(req, res){
	console.log(req.body, ' <- req.body in create review')
	// Use a Model to find the movie with an id (req.params.id)
	MovieModel.findById(req.params.id)
			   .then(function(movieDocument){

					console.log(movieDocument)
					// mutating a document, 
					// we are adding/or removing/updating 
					// something you found from the database

					// req.body is our review
					// req.user is our logged in user
					// assinged by deserialize user in passport/config
					// file, the last function in that file!
					req.body.username = req.user.name;
					req.body.userId = req.user._id;
					req.body.userAvatar = req.user.avatar;



					movieDocument.reviews.push(req.body);
					// you have to save the document to tell 
					// mongodb you change something, cuz this 
					// exists on our express server, mongodb
					// doesn't know we added req.body to the movies
					// reviews array
					movieDocument.save()
								 .then(function(){
									res.redirect(`/movies/${req.params.id}`)
								 })
					

						// Then with the movie we found, we want to add a review to the movie's reviews array
						// to create a review

			   }).catch(err =>{
				console.log(err);
				res.send(err)
			   })

}