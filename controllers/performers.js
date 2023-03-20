const Performer = require("../models/performer");
const Movie = require("../models/movie");

module.exports = {
  new: newPerformer,
  create,
  addToCast
};

function addToCast(req, res){

	// Find the movie from the database
	// req.params.id variable is defined in the routes
	// the value of req.params.id is defined 
	Movie.findById(req.params.id)
		 .then(function(movieDoc){
			// add the performers id to the movie's cast array
			// req.body is the contents of the form, performerId comes from the "name" attribute 
			// on the select menu in the movies show.ejs
			movieDoc.cast.push(req.body.performerId);
			// When mutating a document from the database
			movieDoc.save()
					.then(function(){
						// redirect the user 
						res.redirect(`/movies/${movieDoc._id}`)
					}).catch(err => {
						console.log(err);
						res.send(err);
					})

		 }).catch(err => {
			console.log(err);
			res.send(err)
		 })
	
}

function create(req, res) {
  // Need to "fix" date formatting to prevent day off by 1
  // This is due to the <input type="date"> returning the date
  // string in this format:  "YYYY-MM-DD"
  // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
  const s = req.body.born;
  req.body.born = `${s.substr(5, 2)}-${s.substr(8, 2)}-${s.substr(0, 4)}`;
  Performer.create(req.body)
    .then(function (performerDoc) {
      res.redirect("/performers/new");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}

function newPerformer(req, res) {
  Performer.find({})
    .then(function (performers) {
      res.render("performers/new", {
        title: "Add Performer",
        performers,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}
