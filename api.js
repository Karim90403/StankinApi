require('dotenv').config()
const express = require('express');
const app = express.Router();

app.post("/getToken", async (req, res) => {
    try {
        const params = new URLSearchParams();
        params.append('code', `${req.body.code}`);
        params.append('client_id', `${process.env.client_id}`);
        params.append('client_secret', `${process.env.client_secret}`);
        console.log(params);
        let reqest = await axios.post("https://lk.stankin.ru/webapi/oauth/token", {
            data: params,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            }
        })

        res.status(200).json({ reqest })
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err);
    }

})

module.exports = app