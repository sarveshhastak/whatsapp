const mongoose = require("mongoose")


module.exports = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    photo: { type: String, default: "https://res.cloudinary.com/ddbwlbhgr/image/upload/v1749805802/dummy_is4trc.avif" },
    password: { type: String, required: true },
}, { timestamps: true }))