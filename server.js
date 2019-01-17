var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// var db = require("./models");

var PORT = 3000;

var app = express();
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Change to express handlebars
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";
mongoose.connect(MONGODB_URI);

axios.get("https://www.washingtonpost.com/sports/mlb").then(function (response) {
    var $ = cheerio.load(response.data);

    $(".story-body").each(function (i, element) {
        var result = {};

        result.title = $(this).find("h3").children("a").text();
        result.summary = $(this).find("p").text();
        result.link = $(this).find("h3").children("a").attr("href");

        // console.log(result);
        db.Article.create(result)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            })
    })
    res.send("Scrape Complete");
});
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.Article.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})