var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title:{
        type: String,
        index: {
            unique: true
        },
        require: true
    },
    link: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        require: true
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Article = mongoose.model("Article", ArticleSchema)

module.exports= Article;