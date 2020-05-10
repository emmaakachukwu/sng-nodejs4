const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const favicon = require('express-favicon');
require('dotenv').config({path: "./.env"})

app.use(favicon(__dirname + '/public/favicon.png'));
// ROUTES
const studentRoutes = require("./routes/students");
const tutorRoutes = require("./routes/tutors");
const adminRoutes = require("./routes/admin");

mongoose.connect("mongodb+srv://emmaakachukwu:782009ace@cluster0-v3dg0.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    result => {
        console.log("Database connected");
        app.listen(3000 || process.env.PORT);
    }
).catch(
    err => console.log(err)
);

app.use(bodyParser.json())

app.use('/api/v1/students', studentRoutes)
app.use('/api/v1/tutors', tutorRoutes)
app.use('/api/v1/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('This is the home page')
})