// import our movie Model so we can find the movie we want to add a review too
const movie = require("../models/movie");
const MovieModel = require("../models/movie");

module.exports = {
  create,
  delete: deleteReview,
};

function deleteReview(req, res) {
	// Finding the movie with the review whose id is sent over in the params of the delete form 
	// in the movie show page for delete a review
	// and we are double checking that review was made by the logged in user
  MovieModel.findOne({
    "reviews._id": req.params.id,
    "reviews.userId": req.user._id,
  }).then(function (movieDoc) {
	// if we don't find a match, movieDoc would be undefined
	if(!movieDoc) return res.redirect('/movies');

	// remove is method on mongoose subdocuments
	// review is a subdocument
	// its embedded in the movies, One movie has many rev iews
	movieDoc.reviews.remove(req.params.id);  // <- mutated a document!
	// mongodb doesn't know we removed the review, 
	// so we have to call save on the movieDoc to tell mongodb
	movieDoc.save().then(function(){
		res.redirect(`/movies/${movieDoc._id}`); // go back to the movie change where the delete review form was!
	})


  }).catch(err => {
	res.send(err)
  })
}

function create(req, res) {
  console.log(req.body, " <- req.body in create review");
  // Use a Model to find the movie with an id (req.params.id)
  MovieModel.findById(req.params.id)
    .then(function (movieDocument) {
      console.log(movieDocument);
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
      movieDocument.save().then(function () {
        res.redirect(`/movies/${req.params.id}`);
      });

      // Then with the movie we found, we want to add a review to the movie's reviews array
      // to create a review
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}
