const asyncHandler = require("express-async-handler")
const Chat = require("../models/Chat")
const Message = require("../models/Message")
const { Upload } = require("../utils/upload")
const { cloud } = require("../utils/cloud")
const { io } = require("../socket/socket")


exports.createChat = asyncHandler(async (req, res) => {
    const { reciver } = req.body
    const result = await Chat.findOne({
        $and: [{ users: req.user }, { users: reciver }]
    })
    if (!result) {
        // return res.json({ message: "Already In Contact !" })
        await Chat.create({ users: [reciver, req.user] })
    }
    res.json({ message: "Chat Create Success" })
})

exports.getcontacts = asyncHandler(async (req, res) => {
    const result = await Chat.find({ users: req.user, isGroup: false }).populate("users", "name photo mobile")
    const groupResult = await Chat.find({ users: req.user, isGroup: true }).populate("users", "name photo mobile")
    const data = result.map(item => item.users).flat().filter(item => item._id != req.user)
    res.json({ message: "Contact Get Success", result: data, groupResult })
})


exports.sendMessage = asyncHandler(async (req, res) => {
    Upload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload !" })
        }
        // console.log(req.files)

        const image = (req.files && req.files.image) ? req.files.image[0].path : null
        const video = (req.files && req.files.video) ? req.files.video[0].path : null
        const audio = (req.files && req.files.audio) ? req.files.audio[0].path : null

        let img, vdo, ado
        if (image) {
            const { secure_url } = await cloud.uploader.upload(image)
            img = secure_url
        }

        if (video) {
            const { secure_url } = await cloud.uploader.upload(video, { resource_type: "video" })
            vdo = secure_url
        }

        if (audio) {
            const { secure_url } = await cloud.uploader.upload(audio, { resource_type: "video" })
            ado = secure_url
        }

        const { message, reciver, gif, isGroup } = req.body
        let result
        if (isGroup) {
            result = await Chat.findById(reciver)
        } else {
            result = await Chat.findOne({
                $and: [
                    { users: req.user },
                    { users: reciver },
                ]
            })
        }

        if (!result) {
            return res.status(400).json({ message: "No Chat/Contact Found !" })
        }
        await Message.create({
            sender: req.user,
            chat: result._id,
            message,
            gif,
            image: img,
            video: vdo,
            audio: ado
        })
        io.emit("message", { user: reciver, isGroup })
        res.json({ message: "Message Send Success" })
    })

})

exports.getMessages = asyncHandler(async (req, res) => {
    const { user, isGroup, skip, limit } = req.query
    let result
    if (isGroup) {
        result = await Chat.findById(user)
    } else {
        result = await Chat.findOne({
            $and: [{ users: req.user }, { users: user }]
        })
    }
    // console.log(result)
    const total = await Message.countDocuments() // countDocuments() counts total values in database
    const messages = await Message
        .find({ chat: result._id })
        // .skip(skip)
        // .limit(limit)
        .select(" -updatedAt -__v -chat")


    res.json({ message: "Get Message Success", result: messages, total })
})


exports.createGroup = asyncHandler(async (req, res) => {
    const { users, name } = req.body
    users.push(req.user)
    await Chat.create({ name, users, admin: req.user, isGroup: true })
    res.json({ message: "Group Create Success" })
})