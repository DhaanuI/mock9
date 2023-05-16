const mongoose = require("mongoose")
require('dotenv').config()

const grpSchema = mongoose.Schema({
    createdby: String,
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }]
})

const GrpModel = mongoose.model("group", grpSchema)

module.exports = {
    GrpModel
}