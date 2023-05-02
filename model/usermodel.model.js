const mongoose = require("mongoose")

const { PostModel } = require("./postmodel.model")


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: PostModel }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]

})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}