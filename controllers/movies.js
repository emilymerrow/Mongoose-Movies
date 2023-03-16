

module.exports = {
	new: newMovie
}

function newMovie(req, res){


	// Render looks in the views folder
	res.render('movies/new')
}