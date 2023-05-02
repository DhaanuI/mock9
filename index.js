const express = require("express")
const bcrypt = require("bcrypt")
const app = express()
app.use(express.json())

const { connection } = require("./config/db")

const { UserModel } = require("./model/usermodel.model")

const { userRoute } = require("./route/userRoute")
const { postRoute } = require("./route/postRoute")


app.get("/", (req, res) => {
    res.send("Welcome to Backend")
})


app.post("/register", async (req, res) => {
    const { name, email, password, dob, bio } = req.body
    try {
        bcrypt.hash(password, 5, async function (err, hash) {
            const data = new UserModel({ name, email, password: hash, dob, bio })
            await data.save()

            res.status(201).send({ "message": "User registered" })
        });

    }
    catch (err) {
        res.send({ "error": err })
    }
})


app.use("/users", userRoute)
app.use("/posts", postRoute)


app.listen(4500, async (req, res) => {
    try {
        await connection;
        console.log("DB is connected")
    }
    catch (err) {
        console.log("DB is not connected", err)
    }

    console.log("Listening to server at port 4500")
})