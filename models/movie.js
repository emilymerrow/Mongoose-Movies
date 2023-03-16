const mongoose = require('mongoose')


// Schema is a guard on our collection that says
// everytime we want to add a document (object) to our collection 
// in mongodb, it must have this shape, 
// keys must be the same name, and the values must be of the type Specified below (String, Number, Boolean, etc)
const movieSchema = new mongoose.Schema({
	title: String,  // String, is from Mongoose
	releaseYear: Number, // Number is from Mongoose, Schema Types
	mpaaRating: String,
	cast: [String],
	nowShowing: Boolean // Boolean, from mongoose, google mongoose schema types
})

module.exports = mongoose.model('Movie', movieSchema);
// mongoose.model method does two things
// 1. Creates a collection (The bucket) in mongodb named movies, and it says that all the movie Documents
// that we create need to have the shape of our schema

// 2. Returns an object which is our "Model", which we will use in our controller to perform CRUD operations
// on our database, when our server recieves an http request