const multer = require("multer")

exports.photoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")
exports.Upload = multer({ storage: multer.diskStorage({}) }).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
])