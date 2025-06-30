const router = require("express").Router()
const auth = require("./../controllers/auth.controller")

router
    .post("/register-User", auth.registerUser)
    .post("/login-User", auth.loginUser)
    .post("/logout-User", auth.logoutUser)

module.exports = router