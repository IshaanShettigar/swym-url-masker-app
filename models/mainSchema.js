const mongoose = require('mongoose');

const mainSchema = new mongoose.Schema({
    original: {
        type: String,
        unique: true,
        required: [true, "Must provide an original URL"]
    },
    new_url: {
        type: String,

    },
    clicks: {
        type: Number
    }
})

module.exports = mongoose.model("Main", mainSchema);