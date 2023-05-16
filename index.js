const express = require("express")
const http = require("http")
const app = express()
app.use(express.json())
const cors = require("cors")
app.use(cors())
const server = http.createServer(app)
const io = require("socket.io")(server);

const { userRouter } = require("./route/userRoute")
const { UserModel } = require("./model/usermodel")
const { MessageModel } = require("./model/messagemodel")
const { GrpModel } = require("./model/grpmodel")
const { ContactModel } = require("./model/contactmodel")

app.use("/users", userRouter)

const { connection } = require("./config/db")


io.on("connection", (socket) => {

    socket.on("addthisContact", async (userID, contactID) => {
        try {
            let data = await UserModel.findOne({ _id: userID })
            data.contacts.push(contactID);
            await data.save()

            socket.emit("Added to Contacts List", contactID);

            io.to(contactID).emit("Added to Contacts List", userID);
        }

        catch (err) {
            console.log(err)
        }
    });

    socket.on("removethisContact", async (userID, contactID) => {
        try {
            let data = await UserModel.findOne({ _id: userID })
            data.contacts.forEach((item, index) => {
                if (item._id == contactID) {
                    data.contacts.splice(index, 1)
                }
            })

            await data.save()

            socket.emit("Removed from Contacts List", contactID);
        }

        catch (err) {
            console.log(err)
        }
    });

    socket.on("showContacts", async (id) => {
        try {
            let data = await ContactModel.find({ userID: id })
            // socket.emit("Contacts", data);
            io.to(id).emit("Contacts", id);
        }

        catch (err) {
            console.log(err)
        }
    });

    socket.on("sendNewMessage", async (senderID, recipientID, message) => {
        try {
            let postMessage = new MessageModel({
                sender: senderID, receipient: recipientID, content: message, time: Date.now()
            })

            await postMessage.save()

            io.to(recipientID).emit("Check out this New Message", senderID);
        }

        catch (err) {
            console.log(err)
        }
    });


    socket.on("sendNewGroupMessage", async (groupID, senderID, message) => {
        try {
            let postNewGroupMessage = await GrpModel.findOne({ _id: groupID })
            postNewGroupMessage.messages.push({ sender: senderID, content: message, time: Date.now(), recipient: groupID })

            io.to(groupID).emit("Check out this New Group Message", senderID);
        }

        catch (err) {
            console.log(err)
        }
    });


    socket.on("notifyNewMessage", (recipientID, message) => {
        io.to(recipientID).emit("New Message Notification", message);
    });


    socket.on("search", async () => {

    });


    socket.on("disconnect", () => {
        console.log(socket.id + "left")
    });
})



server.listen(4500, async () => {
    try {
        await connection;
        console.log("DB is connected")
    }
    catch (err) {
        console.log("DB is not connected")
    }

    console.log("Server is running at 4500")
})