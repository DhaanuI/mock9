const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRouter = express.Router()
userRouter.use(express.json())

const { UserModel } = require("../model/usermodel")


userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    const userFound = await UserModel.findOne({ email })
    if (userFound) {
        res.send({ "message": "Already User registered" })
    }
    else {
        try {
            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UserModel({ name, email, password: hash })
                await data.save()
                res.status(201).send({ "message": "User registered" })
            });

        }
        catch (err) {
            res.send({ "message": "ERROR" })
        }
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await UserModel.findOne({ email })
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: data._id }, 'masai');
                res.status(201).send({ "message": "Validation done", "token": token, userid: data._id })
            }
            else {
                res.send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.send({ "message": "ERROR" })
    }
})


module.exports = {
    userRouter
}