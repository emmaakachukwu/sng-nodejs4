const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Student = require("../models/students")

router.get("/", (req, res) => {
    res.send("Students home page");
});

router.get("/signup", (req, res) => {
    res.send("Students signup page");
});

// SIGNUP AS A STUDENT
router.post('/signup', (req, res) => {
    const full_name = req.body.full_name
    const email = req.body.email
    const password = req.body.password
    if ( !full_name || !email || !password ) {
        res.status(400).send({
            status: false,
            message: "All fields are required"
        })
        return
    }
    Student.findOne({email}).then(
        user => {
            if ( user ) {
                return res.status(423).send({
                    status: false,
                    message: "This email is already registered"
                })
            }

            bcrypt.hash(password, 12).then(
                password => {
                    let user = new Student({
                        full_name,
                        email,
                        password
                    })
                    return user.save()
                }
            ).then(
                () => res.status(200).send({
                    status: true,
                    message: "User registered successfully"
                })
            ).catch(
                err => console.log(err)
            )
        }
    )
})

// LOGIN AS A STUDENT
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if ( !email || !password ) {
        res.status(400).send({
            status: false,
            message: "Alls fields are required"
        })
        return
    }

    Student.findOne({email}).then(
        user => {
            if ( !user ) {
                return res.status(404).send("Student not found, please provide valid credentials");
            }

            bcrypt.compare(password, user.password).then(
                valid => {
                    if ( !valid ) {
                        return res.status(403).send("Incorrect password, please review details and try again")
                    }
                    const token = jwt.sign({
                        email: user.email,
                        _id: user._id
                    }, "mysecretkey", { expiresIn: "1hr"});
                    res.status(200).send({
                        _id: user._id,
                        token
                    })
                }
            )
        }
    )
})

module.exports = router