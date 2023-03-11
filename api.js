require('dotenv').config()
const express = require('express');
const app = express.Router();
const axios = require('axios');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'karim',
    password: process.env.password,
    host: '194.67.206.53',
    port: 5432,
    database: 'prof_assistant'
})

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
    }

})

app.get("/getLecturers", async (req, res) => {
    let lecturers = []
    pool.query('SELECT DISTINCT professor FROM schedule;', (error, results) => {
        if (error) {
            res.status(400).json({ error: error.message })
        }
        results.rows.forEach( (lecturer) => {
            lecturers.push(lecturer.professor)
        })
        res.status(200).json(lecturers.sort())
    })
})

app.get("/getGroups", async (req, res) => {
    let groups = []
    pool.query('SELECT DISTINCT group_name FROM schedule;', (error, results) => {
        if (error) {
            res.status(400).json({ error: error.message })
        }
        results.rows.forEach( (group) => {
            groups.push(group.group_name)
        })
        res.status(200).json(groups.sort())
    })
})

app.post("/getSemesters", async (req, res) => {
    try {
        response = await axios.get("https://lk.stankin.ru/webapi/api3/student/semesters", {
            headers: { Authorization: 'Bearer ' + eval(req.body.token) }
        })
        res.status(200).json( response.data )
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post("/getModules", async (req, res) => {
    try {
        response = await axios.get(`https://lk.stankin.ru/webapi/api3/student/marks?sem=${req.body.semester}`, {
            headers: { Authorization: 'Bearer ' + eval(req.body.token) }
        })
        res.status(200).json( response.data )
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post("/getTimetable", (req, res) => {
    let tomorrow = new Date(req.body.date)
    tomorrow.setDate(tomorrow.getDate() +1)
    if(req.body.isLecturer){
        pool.query('SELECT * FROM schedule WHERE start_time > $1 AND end_time < $2 AND professor = $3', [new Date(req.body.date), new Date(tomorrow), req.body.lecturer], (error, results) => {
            if (error) {
                res.status(400).json({ error: error.message })
            }
            res.status(200).json(results.rows.sort((a, b) =>a.start_time.getTime()-b.start_time.getTime()))
        })
    }
    else{
        pool.query('SELECT * FROM schedule WHERE start_time > $1 AND end_time < $2 AND group_name = $3', [new Date(req.body.date), new Date(tomorrow), req.body.group], (error, results) => {
            if (error) {
                res.status(400).json({ error: error.message })
            }
            res.status(200).json(results.rows.sort((a, b) =>a.start_time.getTime()-b.start_time.getTime()))
        })
    }
})

module.exports = app