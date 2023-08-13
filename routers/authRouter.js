const express = require('express')
const { loginController, signUpController, validateJWT } = require("../controllers/authController")

const router = express.Router()



router.post("/login", loginController)

router.post("/signup", signUpController)

router.post("/jwtverify", validateJWT)

module.exports = router