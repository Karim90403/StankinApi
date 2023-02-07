require('dotenv').config()
const express = require('express');
const app = express.Router();
const axios = require('axios');
const fs = require('fs');

app.post("/getToken", async (req, res) => {
    try {
        const reqParams = new URLSearchParams();
        reqParams.append('code', `${req.body.code}`);
        reqParams.append('client_id', `${process.env.client_id}`);
        reqParams.append('client_secret', `${process.env.client_secret}`);
        let reqest = await axios.post("https://lk.stankin.ru/webapi/oauth/token", reqParams, "application/x-www-form-urlencoded")
        res.status(200).json(reqest.data)
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err);
    }

})

module.exports = app