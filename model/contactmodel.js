const mongoose = require("mongoose")
require('dotenv').config()

const contactSchema = mongoose.Schema({
    userID: String,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
})

const ContactModel = mongoose.model("contacts", contactSchema)

module.exports = {
    ContactModel
}