const express = require("express")
const mongoose = require("mongoose")

const userRoute = express.Router()
userRoute.use(express.json())

const { UserModel } = require("../model/usermodel.model")


// get all users (populated friends information as well)
userRoute.get("/", async (req, res) => {
    try {
        const data = await UserModel.find().populate("friends posts friendRequests")
        res.status(200).send({ "Users": data })
    }
    catch (err) {
        res.send({ "error": err })
    }
})


// get all friends of specific user
userRoute.get("/:id/friends", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await UserModel.findOne({ _id: id }).populate("friends friendRequests")
        
        const friend = data.friends;
        //console.log(data)
        res.status(200).send({ "Friends": friend })
    }
    catch (err) {
        res.send({ "error": err })
    }
})


// post friend request to specific user
userRoute.post("/:id/friends", async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body
    try {
        const data = await UserModel.findOne({ _id: id })
        const friendreq = data.friendRequests;
        friendreq.push({ _id: userId })
        data.save()
        res.status(201).send({ "message": "Friend request sent" })
    }
    catch (err) {
        res.send({ "error": err })
    }
})


// specific user accept friend request sent by another user 
userRoute.patch("/:id/friends/:friendId", async (req, res) => {
    const id = req.params.id;
    const friend = req.params.friendId;


    try {
        const data = await UserModel.findOne({ _id: id })
        const friendreq = data.friendRequests;
        let spliceIt;
        friendreq.forEach((item, index) => {
            if (item == friend) {
                spliceIt = index
            }
        })

        friendreq.splice(spliceIt, 1)
        data.friends.push({ _id: friend })

        await data.save()

        res.send({ "message": "Friend request action done" })
    }
    catch (err) {
        res.send({ "error": err })
    }
})

module.exports = {
    userRoute
}
