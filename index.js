const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const favicon = require('express-favicon');
// require('dotenv').config({path: "./.env"})

app.use(bodyParser.json())
app.use(cookieParser());
app.use(favicon('./favicon.png'));

// ROUTES
const studentRoutes = require("./routes/students");
const tutorRoutes = require("./routes/tutors");
const adminRoutes = require("./routes/admin");

mongoose.connect("mongodb+srv://emmaakachukwu:782009ace@cluster0-v3dg0.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    result => {
        console.log("Database connected");
        app.listen(process.env.PORT || 5000);
    }
).catch(
    err => console.log(err)
);

app.get('/', (req, res) => {
    res.redirect('/api/v1')
});

app.get('/api/v1', (req, res) => {
    res.send('This is the home page')
});

app.use('/api/v1/students', studentRoutes)
app.use('/api/v1/tutors', tutorRoutes)
app.use('/api/v1/admin', adminRoutes)