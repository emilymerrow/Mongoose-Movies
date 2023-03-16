const mongoose = require('mongoose');
// All of this code is from the Mongoose DOCS!

// /movies is the name of the database, you want 
// to connect to in mongodb, or the name of the database
// you want to create in mongodb 
mongoose.connect('mongodb://127.0.0.1/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// event listener that fires when 
// our express app has created a connection the mongodb
// database running on our computer
db.on('connected', function() {
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});