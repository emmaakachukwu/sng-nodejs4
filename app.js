const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require('dotenv').config()

// ROUTES
const studentRoutes = require("./routes/students");
const tutorRoutes = require("./routes/tutors");
const adminRoutes = require("./routes/admin");

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    result => {
        console.log("Database connected");
        app.listen(3000);
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