const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const app = express()
const httpServer = http.createServer(app)


const io = new Server(httpServer, { cors: { origin: "*" } })

let ONLINE_USERS = []
let TYPING_USERS = []
io.on("connection", (socketData) => {
    socketData.on("Join", data => {
        if (!ONLINE_USERS.find(item => item._id == data._id)) {
            ONLINE_USERS.push({ ...data, sid: socketData.id })
            io.emit("Join Response", ONLINE_USERS)
        }
    })
    socketData.on("typing", data => {
        if (!TYPING_USERS.find(item => item._id == data._id)) {
            TYPING_USERS.push({ ...data, sid: socketData.id })
            io.emit("Typing Response", TYPING_USERS)
        }
    })
    socketData.on("no-typing", data => {
        TYPING_USERS = TYPING_USERS.filter(item => item._id !== data._id)
        io.emit("Typing Response", TYPING_USERS)
    })
    socketData.on("disconnect", data => {
        ONLINE_USERS = ONLINE_USERS.filter(item => item.sid !== socketData.id)
        io.emit("Join Response", ONLINE_USERS)
        TYPING_USERS = TYPING_USERS.filter(item => item.sid !== socketData.id)
        io.emit("Typing Response", TYPING_USERS)
    })
})
module.exports = { app, httpServer, io }