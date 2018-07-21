var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraperNew";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var PORT = process.env.PORT || 3000;

var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routes

app.get("/", function (req, res) {

  res.render("index")

})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {

  axios.get("http://first-avenue.com/calendar").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = []
    $(".even a").each(function (i, element) {

      var result = {};
      result.title = $(this)
        .text();
      result.link = $(this)
        .attr("href");

      result.image = $(this)
        .find("img").attr('src');

      results.push(result)
     

    });
    //how do we create many results

    db.Article.insertMany(results)
      .then(function (dbArticle) {
        res.send("Scrape Complete");
      })
      .catch(function (err) {
        return res.json(err);
      });


    console.log("your in the scrape route")

  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find().then(function (articles) {

    res.json(articles);
    // res.render("index", {articles: JSON.stringify(articles)})

  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id }).populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });

});
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

