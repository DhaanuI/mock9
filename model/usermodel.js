const mongoose = require("mongoose")
require('dotenv').config()

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: { type: String, default: "" },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, default: "", ref: "user" }]
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}