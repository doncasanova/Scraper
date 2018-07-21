var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");


// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraperNew");
// A GET route for scraping the echoJS website

//   // var url = "https://www.thefabricator.com"
//   var url = "http://first-avenue.com/calendar"

//   axios.get(url, function(err,res,body){
//     console.log(body)
// var $ = cherrio.load(body);
// var header = $('.field a');
// var headerText = header.text(
 
// )
//   });
 // A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  axios.get("http://first-avenue.com/calendar/").then(function (response) {
    var $ = cheerio.load(response.data);
  // axios.get("https://www.thefabricator.com/").then(function (response) {
  //   var $ = cheerio.load(response.data);
var test = $(".node-title").first()
//  var testText = test.text()

var test2 = $(".node-title")
var test2 = testFind.find(".field-event").text()
// var testText2 = test2.text()

// var test3 = $(".featured img")
// var testAttr3 = test3.attr('src')

// var test4 = $("text-muted")
// var testText4 = test4.text()


    $("h5").each(function (i, element) {
     
      var result = {};
      result.title = $(this)
        .text();
      // result.link = $(this)
      //   .attr("href");

      // Create a new Article using the `result` object built from scraping
      // db.Article.create(result)
      //   .then(function (dbArticle) {
      //   })
      //   .catch(function (err) {
      //     return res.json(err);
      //   });
    });
    console.log("your in the test scrape route")
    
    res.send(`${testFind}`);
  });
});


  // Start the server
  app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });
