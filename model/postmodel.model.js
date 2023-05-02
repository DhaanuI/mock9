const mongoose = require("mongoose")

const { UserModel } = require("./usermodel.model")

const postSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: String,
        createdAt: Date
    }]
})


const PostModel = mongoose.model("post", postSchema)

module.exports = {
    PostModel
}