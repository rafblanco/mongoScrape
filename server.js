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

app.get("/", function(req, res){
    res.render("index")
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
        res.render("index", result);
    })
        // .then(function () {
        //     // Find all results from the Article collection in the db
        //     db.Article.find({}, function (error, articles) {
        //         // Throw any errors to the console
        //         if (error) {
        //             console.log(error);
        //         }
        //         // If there are no errors, send the data to the browser as json
        //         else {
        //             res.render("index", articles);
        //         }
        //     });
        // })
})


// Route for getting all Articles from the db
app.get("/all", function (req, res) {
    // Find all results from the Article collection in the db
    db.Article.find({}, function (error, found) {
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

// Route for getting comments for a specific article
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
});

// Route for posting comments to a specific article
app.post("/article/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            db.Article.findOneAndUpdate({ id: req.params.id }, { comment: dbComment._id }, { new: true })
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
});

app.get("/article/:id", function(req, res){
    db.Comment.remove({
        _id: mongoosejs.ObjectID(req.params.id)
    },
    function(err, removed){
        if(err){
            console.log(err)
            // res.send(err)
        } else {
            console.log(removed)
        }
    })
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})