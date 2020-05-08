const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const studentRoutes = require("./routes/students");
const tutorRoutes = require("./routes/tutors");
const adminRoutes = require("./routes/admin");

mongoose.connect("mongodb+srv://emmaakachukwu:782009ace@cluster0-v3dg0.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    result => {
        console.log("Database connected");
        app.listen(3000);
    }
).catch(
    err => console.log(err)
);

app.use(bodyParser.json())

app.use('/students', studentRoutes)
app.use('/tutors', tutorRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('This is the home page')
})