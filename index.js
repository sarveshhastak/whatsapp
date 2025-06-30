const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { userProtected } = require("./middleware/protected.middleware")
const { httpServer, app } = require("./socket/socket")
require("dotenv").config()

// const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use("/api/auth", require("./routes/auth.route"))
app.use("/api/user", userProtected, require("./routes/user.route"))
app.use("/api/chat", userProtected, require("./routes/chat.route"))
app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found !" })
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "Server Error !" + err.message })

})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("Mongodb Connected...")
    httpServer.listen(process.env.PORT, console.log("Server Running..."))

})