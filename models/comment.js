const {mongoose , Schema, model} = require("mongoose");

const userComment = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : "blog"
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
} , {timestamps : true});

const CommentDB = model("comment" , userComment);

module.exports = CommentDB