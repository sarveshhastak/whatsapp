const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const { photoUpload } = require("../utils/upload")
const { cloud } = require("../utils/cloud")



exports.updateProfile = asyncHandler(async (req, res) => {
    photoUpload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image !" })
        }
        if (req.file) {
            const { secure_url } = await cloud.uploader.upload(req.file.path)
            req.body.photo = secure_url
        }
        const result = await User.findByIdAndUpdate(req.params.uid, req.body, { new: true })
        res.json({
            message: "User Profiile Update Success", result: {
                _id: result._id,
                name: result.name,
                mobile: result.mobile,
                photo: result.photo,
            }
        })
    })

})



exports.searchUser = asyncHandler(async (req, res) => {
    const { search } = req.query
    const result = await User.findOne({ mobile: search }).select("_id name photo mobile")
    res.json({ message: "Search Success", result })
})