require('dotenv').config();
const express = require("express")
const Main = require('./models/mainSchema')
const connectDB = require("./db/connect");
const app = express()
const cors = require('cors');
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json())
const crypto = require('crypto')


app.use(express.static('./frontend'));


app.post('/sendURLs', async (req, res) => {
    await Main.deleteMany({})
    let urls = req.body.urls;
    let newURLs = {
    }
    for (let i = 0; i < urls.length; i++) {
        newURLs[urls[i]] = `slug${i}`
        try {
            await Main.create({ original: urls[i], new_url: newURLs[urls[i]], clicks: 0 })
        }
        catch (error) {
            // if (error instanceof mongoose.Error.ValidationError) {
            //     // Handle validation errors
            //     return res.status(400).json({ error: 'Validation error', details: error.errors });
            // } else if (error instanceof mongoose.Error.MongoServerError) {
            //     // Handle MongoServerError
            //     return res.status(500).json({ error: 'MongoDB server error', details: error.message });
            // }
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    }
    res.status(200).json(newURLs)
})

app.get('/urls', async (req, res) => {
    try {
        console.log("------------FETCHING-------------");
        let data = await Main.find({})
        const filteredData = data.map(item => ({
            original: item.original,
            new_url: item.new_url,
            clicks: item.clicks
        }));
        console.log(filteredData);
        res.status(200).json({ "data": filteredData })
    }
    catch (error) {
        console.log(error);
    }
})

app.get('/:slug', async (req, res) => {
    console.log("------REDIRECTING-------------");
    let slug = req.params.slug;
    // res.status(200).json({ newUrl: "test" })
    // check if slug in database else return error
    console.log("SLUG", slug);
    try {
        let original_url = await Main.findOne({ new_url: slug })
        console.log(original_url.clicks);
        await Main.updateOne({ new_url: slug, clicks: original_url.clicks + 1 })
        // console.log(new URL(original_url));
        res.redirect(`https://${original_url.original}`)

        // res.redirect(new URL(original_url))
    }
    catch {
        console.log("Error retreving url")
        res.status(404).send("URL NOT IN DATABASE")
    }
})



// app.get('/', (req, res) => {
//     console.log(crypto.randomUUID());
// })




const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("Server listening on port ", port);
        })
    }
    catch {
        console.log(error)
    }
}

start()