const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const loginController = async (req, res) => {
    const { email, password } = req.body;
    if (email === null) {
        console.log("No email, insert error here");
        res.send("NO EMAIL")
    }
    else if (password === null) {
        conosle.log("No password error!!!")
        res.send("NO PASSWORD")
    }
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            res.send("No user found")
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch === true) {
            // let us create a jwt
            let token = jwt.sign({ id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET)
            res.json({ "token": token, "user": user })
        }
    }
    catch (error) {
        console.log(error);
    }
}

const signUpController = async (req, res) => {
    const { email, password } = req.body
    if (email === null) {
        console.log("No email, insert error here");
    }
    else if (password === null) {
        conosle.log("No password error!!!")
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt)
        console.log(hashedPwd);
        const user = await User.create({ email: email, password: hashedPwd })
        res.json({ "msg": user })
    }
    catch (error) {
        console.log("---------ERROR---------", error);
    }
}

const validateJWT = async (req, res) => {
    const token = req.body.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ "payload": payload })
}

module.exports = { loginController, signUpController, validateJWT }