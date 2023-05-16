const mongoose = require("mongoose")
require('dotenv').config()

const messageSchema = mongoose.Schema({
    sender: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    receipient: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    content: String,
    time: Date
})

const MessageModel = mongoose.model("messages", messageSchema)

module.exports = {
    MessageModel
}