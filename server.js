var express = require("express");
var exphbs = require("express-handlebars");
var logger =  require("morgan");
var mongoose = require("mongoose");

// axios can be used on client and on server
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var routes = require("./controller/app");

var PORT = 3000;

// Initialize Express
var app = express();


app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.use(routes);

// Define PORT
var port = process.env.PORT || 3000;

app.listen(port,function(){
    console.log("Listening on PORT" + port);
});

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Scraper", { useNewUrlParser: true });
//to check if mongoose connection is available to our test db
var connec = mongoose.connection;
connec.on('error', console.error.bind(console,'connection error'));
connec.once('open',function(){
    console.log("Connected to Mongoose!")
})
//Routes

