// Routes
var express = require("express");
var router = express.Router();
console.log('routes')

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
  
    axios.get("http://first-avenue.com/calendar").then(function (response) {
      var $ = cheerio.load(response.data);
  
      $(".field a").each(function (i, element) {
       
        var result = {};
        result.title = $(this)
          .text();
        result.link = $(this)
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
          })
          .catch(function (err) {
            return res.json(err);
          });
      });
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function (req, res) {
    db.Article.find().then(function (article) {
  
      res.json(article);
      // res.render('index')
  
    });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  
  });
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function (req, res) {
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
  module.exports = router;