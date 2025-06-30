const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const registerUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    const result = await User.findOne({ mobile })
    if (result) {
        return res.status(401).json({ message: "Mobile Already Exist !" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hash })
    res.json({ message: "User Register Success" })
})

const loginUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    const result = await User.findOne({ mobile })
    if (!result) {
        return res.status(401).json({ message: "Mobile Does Not Exist !" })
    }

    const isValid = await bcrypt.compare(password, result.password)
    if (!isValid) {
        return res.status(401).json({ message: "Invalid Password !" })
    }
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })
    res.cookie("USER", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.MODE_ENV === "dev" ? false : true
    })
    res.json({
        message: "User Login Success", result: {
            _id: result._id,
            name: result.name,
            photo: result.photo,
            mobile: result.mobile,
        }
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "User Logout Success" })
})


module.exports = { registerUser, loginUser, logoutUser }