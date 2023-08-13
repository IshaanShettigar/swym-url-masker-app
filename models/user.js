const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is a required field"],
        validate: {
            validator: validator.isEmail,
            message: "Not a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: 6
    }
})

userSchema.pre("remove", async (next) => {
    await this.model("Link").remove({ userId: this._id }, next)
    console.log("REMOVED CORRESPONDING LINKS AS WELL");
})

module.exports = mongoose.model("User", userSchema)