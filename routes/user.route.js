const router = require("express").Router()
const user = require("./../controllers/user.controller")

router
    .patch("/update-profile/:uid", user.updateProfile)
    .get("/search", user.searchUser)


module.exports = router