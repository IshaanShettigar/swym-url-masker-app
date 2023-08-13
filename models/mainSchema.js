const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    original: {
        type: String,
        required: [true, "Must provide an original URL"]
    },
    new_url: {
        type: String,
    },
    clicks: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
})


module.exports = mongoose.model("Link", linkSchema);