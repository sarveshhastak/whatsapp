const jwt = require("jsonwebtoken")
exports.userProtected = async (req, res, next) => {
    const USER = req.cookies.USER
    if (!USER) {
        return res.status(401).json({ message: "NO Cookie Found !" })
    }
    jwt.verify(USER, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            console.log(err)

            return res.status(401).json({ message: "Invalid Token !" })
        }
        req.user = decode._id
        next()
    })
}