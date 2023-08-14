require('dotenv').config();
const express = require("express")
const Link = require('./models/mainSchema')
const User = require("./models/user")
const connectDB = require("./db/connect");
const authRouter = require("./routers/authRouter")
const authMiddleware = require("./middleware/authMiddleware")
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { log } = require('console');
const app = express()


app.use(express.json())

// // adding logic to redirect if already logged in 
// app.use((req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         try {
//             const decodedToken = jwt.verify(token, 'your-secret-key');
//             return res.redirect('/index.html');
//         } catch (err) {
//             // Token is invalid or expired, continue to next middleware
//         }
//     }
//     next();
// })

app.use(express.static('./frontend/'));

app.use("/auth", authRouter)

app.post('/sendURLs', authMiddleware, async (req, res) => {
    let urls = req.body.urls;
    let newURLs = {
    }
    for (let i = 0; i < urls.length; i++) {
        newURLs[urls[i]] = crypto.randomUUID()
        try {
            await Link.create({ original: urls[i], new_url: newURLs[urls[i]], clicks: 0, userId: req.user.id })
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    res.status(200).json({ "user": req.user, "links": newURLs })
})

app.get('/urls', authMiddleware, async (req, res) => {
    try {
        console.log("------------FETCHING-------------");
        let data = await Link.find({})
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
        let data = await Link.findOne({ new_url: slug })
        const updatedData = await Link.updateOne({ new_url: slug }, { $set: { clicks: data.clicks + 1 } })
        if (data.original.startsWith("https://")) {
            res.redirect(`${data.original}`)
        }
        else {
            res.redirect(`https://${data.original}`)
        }
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
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash("pes12345", salt)
        const user = await User.create({ email: "ishaanshettigar@gmai.com", password: hashedPwd })
        app.listen(port, () => {
            console.log("Server listening on port ", port);
        })
    }
    catch (error) {
        console.log(error)
    }
}

start()