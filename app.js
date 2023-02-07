require('dotenv').config()
const express = require('express');
const cors = require('cors');
const api = require('./api');
const path = require('path');
const https = require("https");

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api", api)
app.use(express.static(path.join(__dirname, "public")))


https
    .createServer(app)
    .listen(process.env.PORT, () => {        
        console.log(`App ran at ${process.env.PORT}`)
    })