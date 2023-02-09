require('dotenv').config()
const express = require('express');
const app = express.Router();
const axios = require('axios');

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

app.post("/autorisation", async (req, res) => {
    try {
        res.status(200).json({
            token: req.body.login,
            message: "this is not true token"
        })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post("/registration", async (req, res) => {
    try {
        res.status(200).json({
            token: req.body.login,
            message: "this is not true token"
        })
    } catch (err) {
        res.status(200).json({ error: err.message });
    }
})

app.get("/getGroups", async (req, res) => {
    try {
        response = await axios.get("https://api.stbot.sdore.me/schedule/groups/")
        res.status(200).json( response.data )
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.get("/getLecturers", async (req, res) => {
    try {
        response = await axios.get("https://api.stbot.sdore.me/lecturer/")
        res.status(200).json( response.data )
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post("/getData", async (req, res) => {
    console.log(req.body.url);
    try {
        response = await axios.get(`${req.body.url}`)
        res.status(200).json( response.data )
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = app