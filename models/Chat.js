const mongoose = require("mongoose")

module.exports = mongoose.model("chat", new mongoose.Schema({
    users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    photo: { type: String, default: "https://res.cloudinary.com/ddbwlbhgr/image/upload/v1749805802/dummy_is4trc.avif" },
    admin: { type: mongoose.Types.ObjectId, ref: "user" }
}, { timestamps: true }))