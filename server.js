var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Change to express handlebars
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) {
    db.Article.find({})
        .then(function (articles) {
            res.render("index", { articles: articles });
        })
        .catch(function (err) {
            console.log(err)
        })
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.washingtonpost.com/sports/mlb").then(function (response) {
        var $ = cheerio.load(response.data);

        var result = {};
        $(".story-body").each(function () {


            result.title = $(this).find("h3").children("a").text();
            result.summary = $(this).find("p").text();
            result.link = $(this).find("h3").children("a").attr("href");

            // console.log(result);
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log("works");
                })
                .catch(function (err) {
                    console.log(err);
                })
        })
        // res.render("index", result);
        res.send("complete")
    })

})


// Route for getting all Articles from the db
app.get("/all", function (req, res) {
    db.Article.find({})
        .then(function (articles) {
            res.render("index", { articles: articles });
        })
        .catch(function (err) {
            console.log(err)
        })
});

// Route for getting comments for a specific article
app.get("/article/:id", function (req, res) {

    db.Article.findOne({_id: req.params.id})
        .populate("comment")
        .then(function (comments) {
            console.log(comments)
            // res.render("index", { comment: comment })
            res.json(comments)
        })
        .catch(function (err) {
            res.json(err)
        })
});

// Route for posting comments for a specific article
app.post("/article/:id", function (req, res) {
    // console.log(req.body.newCom)
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({_id: req.params.id },{ $push: { comment: dbComment}}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
});

// Route for deleting comments for a specific article
app.delete("/article/:id", function (req, res) {
    db.Comment.remove({
        _id: req.params.id
    },
        function (err, removed) {
            if (err) {
                console.log(err)
                // res.send(err)
            } else {
                console.log(removed)
                res.json(removed)
            }
        })
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})