const router = require("express").Router()
const chat = require("./../controllers/chat.controller")

router
    .post("/create-chat", chat.createChat)
    .get("/get-contacts", chat.getcontacts)
    .post("/send-message", chat.sendMessage)
    .get("/get-messages", chat.getMessages)
    .post("/create-group", chat.createGroup)


module.exports = router