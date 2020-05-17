const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tutor = require("../models/tutors")
const Subject = require("../models/subjects")

router.get("/", (req, res) => {
    res.send("Tutors home page");
});

router.get("/signup", (req, res) => {
    res.send("Tutors signup page");
});

// SIGNUP AS A TUTOR
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
    Tutor.findOne({email}).then(
        user => {
            if ( user ) {
                return res.status(423).send({
                    status: false,
                    message: "This email is already registered"
                })
            }

            bcrypt.hash(password, 12).then(
                password => {
                    let user = new Tutor({
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

// LOGIN AS A TUTOR
router.post('/login', async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if ( !email || !password ) {
        res.status(400).send({
            status: false,
            message: "All fields are required"
        })
        return
    }

    const findTutor = await Tutor.findOne({email})
    try {
        if ( !findTutor ) {
            return res.status(404).send({
                status: false,
                message: "Tutor not found, please provide valid credentials"
            });
        }
    } catch ( err ) {
        console.log(err)
    }    

    const checkPassword = await bcrypt.compare(password, findTutor.password)
    try {
        if ( !checkPassword ) {
            return res.status(403).send({
                status: false,
                message: "Incorrect password, please review details and try again"
            })
        }
    } catch ( err ) {
        console.log(err)
    }
    
    const token = jwt.sign({
        email: findTutor.email,
        _id: findTutor._id
    }, "mysecretkey", { expiresIn: "1hr"});
    res.cookie('access-token', token)
    res.cookie('access-level', findTutor.access_level)
    res.status(200).send({
        _id: findTutor._id,        
        token,
        findTutor
    })
})

/********** VERIFY JWTs **********/
const verifyjwt = function(token){
    var result
    if ( token ) {
        jwt.verify(token, "mysecretkey", err => {
            if ( err ) {
                result = ({
                    status: false,
                    message: "Invalid token"
                })
            } else {
                result = ({
                    status: true
                })
            }
        })
    } else {
        result = {
            status: false,
            message: "No token provided"
        }
    }

    return result
}

/**********  **********/

// REGISTER TO TAKE A SUBJECT
router.patch('/add-subject/:userId', async (req, res) => {
    var token = req.cookies['access-token']
    var user = req.cookies['access-level']
    let verify = verifyjwt(token)

    const id = req.params.userId
    if ( verify.status != false ) {
        if ( user != 'tutor' ) {
            return res.send({
                status: false,
                message: "You are not logged in as a tutor. Please login again"
            })
        }

        const sub = new Tutor({
            subjects: req.body.subject,
        })
        
        const subject = req.body.subject

        if ( !subject ) {
            res.status(400).send({
                status: false,
                message: "All fields are required"
            })
            return
        }
        // return res.send(sub.subjects)

        try {
            const tutor = await Tutor.findOne({_id: id})
            if ( !tutor ) {
                return res.send({
                    status: false,
                    message: "Tutor not found"
                })
            }
        }catch(err){
            console.log(err)
        }
        
        try {
            const checkSubjects = await Subject.findOne({_id: subject})
            const checkTutorSubjects = await Tutor.findOne({_id: id}).populate('subjects')

            if ( !checkSubjects ) {
                return res.status(423).send({
                    status: false,
                    message: "Subject is not available for tutoring"
                })
            } else {
                checkTutorSubjects.subjects.forEach( async element => {
                    try {
                        if ( element._id == subject ) {
                            return res.send({
                                status: false,
                                message: "Subject already registered under tutor"
                            })
                        }
                    } catch ( err ) {
                        console.log(err)
                    }                    
                });

                if ( checkTutorSubjects.subjects.includes(subject) ) {
                    return res.send({
                        status: false,
                        message: "Subject already registered under tutor"
                    })
                }

                const updateSub = await Tutor.updateOne(
                    {_id: id},
                    {$push: {subjects: sub.subjects}}
                )
                res.status(200).send({
                    status: true,
                    message: "Subject created successfully"
                })
            }
        } catch ( err ) {
            console.log(err)
        }       
        
    } else {
        res.send({
            verify
        })
    }
})

// VIEW ALL YOUR REGISTERED SUBJECTS


// UPDATE A REGISTERED SUBJECT


// DELETE A REGISTERED SUBJECT

module.exports = router