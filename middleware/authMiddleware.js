const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        console.log("Error Auth middleware");
        res.status(500).json({ "failure": true })
    }
    console.log(authHeader);
    // check if the token is valid
    token = authHeader.split(" ")[1]
    try {
        let payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { email: payload.email, id: payload.id }
        next()
    }
    catch (error) {
        console.log("ERROR IN AUTH MIDDLEWARE -----------------");
        res.status(500).send("INTERNAL SERVER ERROR")
    }
}

module.exports = auth