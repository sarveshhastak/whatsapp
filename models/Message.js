const mongoose = require("mongoose")

module.exports = mongoose.model("message", new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    chat: { type: mongoose.Types.ObjectId, ref: "chat", required: true },
    message: { type: String },
    image: { type: String },
    video: { type: String },
    audio: { type: String },
    gif: { type: String },
}, { timestamps: true }))