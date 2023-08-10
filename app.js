require('dotenv').config();
const express = require("express")
const Main = require('./models/mainSchema')
const connectDB = require("./db/connect");
const app = express()

app.use(express.json())


app.post('/sendURLs', async (req, res) => {
    await Main.deleteMany({})
    let urls = req.body.urls;
    let newURLs = {
    }
    for (let i = 0; i < urls.length; i++) {
        newURLs[urls[i]] = `ishaan@swym${i}`
        try {
            await Main.create({ original: urls[i], new_url: `ishaan@swym${i}`, clicks: 0 })
        }
        catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                // Handle validation errors
                return res.status(400).json({ error: 'Validation error', details: error.errors });
            } else if (error instanceof mongoose.Error.MongoServerError) {
                // Handle MongoServerError
                return res.status(500).json({ error: 'MongoDB server error', details: error.message });
            }
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    }
    res.status(200).json(newURLs)
})

app.get('/:slug', async (req, res) => {
    let slug = req.params.slug;
    // res.status(200).json({ newUrl: "test" })
    // check if slug in database else return error
    try {
        let original_url = await Main.findOne({ new_url: slug })
        console.log(original_url);
        res.redirect(original_url.original)
    }
    catch {
        console.log("Error retreving url")
        res.status(404).send("URL NOT IN DATABASE")
    }
})



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