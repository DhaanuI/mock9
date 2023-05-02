const express = require("express")
const mongoose = require("mongoose")

const postRoute = express.Router()
postRoute.use(express.json())

const { PostModel } = require("../model/postmodel.model")
const { UserModel } = require("../model/usermodel.model")


// get all Post (populated user details as well)
postRoute.get("/", async (req, res) => {
    try {
        const data = await PostModel.find().populate("user likes comments.user")
        res.status(200).send({ "Posts": data })
    }
    catch (err) {
        res.send({ "error": err })
    }
})


// add new Post
postRoute.post("/", async (req, res) => {
    const { user, text, image, createdAt } = req.body
    try {
        const data = new PostModel({ user, text, image, createdAt })
        await data.save()

        const userData = await UserModel.findOne({ _id: user })
        userData.posts.push(data)
        await userData.save()


        res.status(201).send({ "message": "Post added" })
    }
    catch (err) {
        res.send({ "error": err })
    }
})


// Update existing Post
postRoute.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const payLoad = req.body
    try {
        const data = await PostModel.findOneAndUpdate({ _id: id }, payLoad)
        res.send({ "message": "Post modified" })
    }
    catch (err) {
        res.send({ "error": err })
    }

})


// delete existing Post
postRoute.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await PostModel.findOneAndDelete({ _id: id })
        res.send({ "Message": "Post has been selected" })
    }
    catch (err) {
        res.send({ "error": err })
    }

})



// add like to existing Post
postRoute.post("/:id/like", async (req, res) => {
    const id = req.params.id;
    const { userID } = req.body
    try {
        const data = await PostModel.findOne({ _id: id })
      
        data.likes.push(userID)
        await data.save()

        res.send({ "message": "You liked this POST" })

    }
    catch (err) {
        res.send({ "error": err })
    }

})


// add comment to existing Post
postRoute.post("/:id/comment", async (req, res) => {
    const id = req.params.id;

    const { user, text, createdAt } = req.body
    try {
        const data = await PostModel.findOne({ _id: id })
        data.comments.push(req.body)
        await data.save()

        res.send({ "message": "You commented on this POST" })

    }
    catch (err) {
        res.send({ "error": err })
    }
})




// get specific Post (populated user details as well)
postRoute.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await PostModel.findOne({ _id: id }).populate("user likes comments.user")
        res.status(200).send({ "Selected Post with likes and comments": data })
    }
    catch (err) {
        res.send({ "error": err })
    }

})



module.exports = {
    postRoute
}
