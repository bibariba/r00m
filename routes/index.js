var express = require('express');
var router = express.Router();
var moment = require('moment');

module.exports = router;




// =========================================================
// =
// =   SET UP MONGODB AND MONGOOSE
// =

// MongoDB is a JavaScript-oriented database.
// http://docs.mongodb.org/manual/core/crud-introduction/

// --> In Cloud9, you need to start MongoDB before running your app by typing 
// ./mongod 
// at the terminal ("bash" window). But you only need to do that once per workspace. 
// MongoDB should run forever after that.

// Mongoose makes it easy to access MongoDB using a pattern of "models".
// http://mongoosejs.com

// Use Mongoose to connect to the MongoDB database. We'll call our
// database "networks". It will be created automatically if it doesn't already exist.

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || ('mongodb://' + process.env.IP + '/networks'));




// =========================================================
// =
// =   DEFINE OUR DATA MODELS
// =

// Define the data structure of a Phrase model
// It has width, height, top, and left attributes, which are required to be numbers from 0–100
// And it has a color attribute, which is optionaland is a string (text)
// Allowed data types (Number, String, Date...): http://mongoosejs.com/docs/schematypes.html

var Furniture = mongoose.model('Furniture', {
  kind: {type: String, required: true},
  used: {type: Date, default: Date.now},
});





// =========================================================
// =
// =   WEB ROUTES
// =


// HOME PAGE
// /

router.get('/', function(request, response, toss) {
  
  // When the server receives a request for "/", this code runs

  // Render the "home" template (located in the "views" folder).
  response.render('home');

});






// CREATE PAGE
// /create?kind=cactus
// This is called by ajax when the user wants to add a piece of furniture to the page.
// Creates a record in the database, and returns the total number of records for this furniture kind.

router.get('/create', function(request, response, toss) {
  
  // When the server receives a request for "/create", this code runs
  
  // Make a new Furniture in memory, with the parameters that come from the URL 
  // ?kind=cactus
  // and store it in the furniture variable
  var furniture = new Furniture({
    kind: request.query.kind
  });
  
  // Now save it to the database
  furniture.save(function(err) {
    // This code runs once the database save is complete

    // An err here can be due to validations
    if (err) return toss(err);
    
    // Now count the total number of furniture of this type in the database
    
    Furniture.count({kind: request.query.kind}, function(err, total_count) {
      if (err) return toss(err);
      
      console.log('Created', request.query.kind, total_count, 'total');
      
      response.locals.kind = request.query.kind;
      response.locals.total_count = total_count;
      
      // Render the "create" page to return the count
      response.render('create');
      
    });

  });
  
});


// RESET PAGE
// /reset
// Clears the whole database! Including the log of when everyone added their furnitures.

router.get('/reset', function(request, response, toss) {
  Furniture.find().remove(function(err) {
    if (err) return toss(err);
    response.redirect('/');
  });
});


// ABOUT PAGE
// /about

router.get('/about', function(request, response) {

  // When the server receives a request for "/about", this code runs

  response.render('about');
  
});
