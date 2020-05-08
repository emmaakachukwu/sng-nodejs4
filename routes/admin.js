const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../models/tutors")
const Subject = require("../models/subjects")
const Category = require("../models/categories")

// LOGIN AS AN ADMIN
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if ( !email || !password ) {
        res.status(400).send({
            status: false,
            message: "All fields are required"
        })
        return
    }

    Admin.findOne({email}).then(
        user => {
            if ( !user || user.isAdmin == false ) {
                return res.status(404).send("Email not found, please provide valid credentials");
            }

            bcrypt.compare(password, user.password).then(
                valid => {
                    if ( !valid ) {
                        return res.status(403).send("Incorrect password, please review details and try again")
                    }
                    const token = jwt.sign({
                        email: user.email,
                        _id: user._id
                    }, "mysecretkey", { expiresIn: "24hr"});
                    res.status(200).send({
                        _id: user._id,
                        token
                    })
                }
            )
        }
    )
})

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

/*********** SUBJECTS **********/

// CREATE SUBJECT (ADMIN ONLY)
router.post('/create-subject', (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)
    if ( verify.status != false ) {
        const subject = new Subject({
            name: req.body.name,
            category: req.body.category
        })
        const name = subject.name
        const category = subject.category

        if ( !name || !category ) {
            res.status(400).send({
                status: false,
                message: "All fields are required"
            })
            return
        }
        
        Subject.findOne({name, category}).then(
            sub => {
                if ( sub ) {
                    return res.status(423).send({
                        status: false,
                        message: "Subject has already been created under the specified category"
                    })
                }
    
                subject.save()
                
                res.status(200).send({
                    status: true,
                    message: "Subject created successfully"
                })
            }
        )
    } else {
        res.send({
            verify
        })
    }
    
})

// UPDATE A SUBJECT IN A CATEGORY(BY ID)
router.patch('/update-subject/:id', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const id = req.params.id
    const name = req.body.name
    const category = req.body.category

    if ( verify.status != false ) {
        if ( !name || !category ) {
            return res.status(400).send({
                status: false,
                message: "All fields are required"
            })
        }

        const a = Subject.findOne({_id: id}).then(
            r => {
                if ( !r ) {
                    return res.send({
                        status: false,
                        message: "Subject with ID: " + id + " not found"
                    })
                }
            }
        )

        Subject.findOne({name, category}).then(
            sub => {
                if ( sub ) {
                    return res.status(423).send({
                        status: false,
                        message: "Subject has already been created under the specified category"
                    })
                }
            }
        )
    
        try {          
            const updateSubject = await Subject.updateOne(
                {_id: id},
                {$set: { name: name, category: category }}
            )
            res.status(200).send({
                status: true,
                message: "Subject updated successfully"
            })
        }
        catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

// DELETE A SUBJECT IN A CATEGORY BY ID
router.delete('/delete-subject/:id', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const id = req.params.id

    if ( verify.status != false ) {
        try {
            const removedSubject = await Subject.remove({_id: id})
            res.status(200).send({
                status: true,
                message: "Subject deleted successfully"
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

/*********** TUTORS **********/

// RETRIEVE ALL TUTORS
router.get('/tutors', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    if ( verify.status != false ) {
        try {
            const tutors = await Admin.find({})
            res.status(200).send({
                status: true,
                message: tutors
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

// GET A TUTOR BY ID
router.get('/tutors/:id', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const id = req.params.id

    if ( verify.status != false ) {
        try {
            const tutor = await Admin.findOne({_id: id})
            res.status(200).send({
                status: true,
                message: tutor
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

// DEACTIVATE A TUTOR BY ID
router.patch('/tutors/:id', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const id = req.params.id

    if ( verify.status != false ) {
        try {
            const tutor = await Admin.updateOne(
                {_id: id},
                {$set: { isActive: false }}
            )
            res.status(200).send({
                status: true,
                message: "Tutor has been deactivated successfully"
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

/*********** CATEGORIES **********/

// ADD CATEGORIES
router.post('/create-category', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const category = new Category({
        name: req.body.name,
    })

    if ( verify.status != false ) {
        if ( !category.name ) {
            return res.status(400).send({
                status: false,
                message: "All fields are required"
            })
        }
        const checkCategory = await Category.findOne({name: category.name})
        if ( checkCategory ) {
            return res.send({
                status: false,
                message: "Category already added"
            })
        }

        try {
            await category.save()
            res.status(200).send({
                status: true,
                message: "Category created successfully"
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

// GET CATEGORIES
// router.get('/categories/:id', async (req, res) => {
//     var token = req.headers['access-token']
//     let verify = verifyjwt(token)

//     const id = req.params.id

//     if ( verify.status != false ) {
//         try {
//             const cats = await Admin.find({_id: id}).populate("Subject")
//             res.status(200).send({
//                 status: true,
//                 message: cats
//             })
//         } catch( err ) {
//             console.log(err)
//         }
//     } else {
//         res.send({
//             verify
//         })
//     }
// })

// UPDATE CATEGORY
router.patch('/update-category', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const name = req.body.name
    const new_name = req.body.new_name

    if ( verify.status != false ) {
        if ( !name || !new_name ) {
            return res.send({
                status: false,
                message: "All fields are required"
            })
        }

        try {
            checkCategoryName = await Category.findOne({name})
            if ( !checkCategoryName ) {
                return res.send({
                    status: false,
                    message: "Category: " + name + " not found"
                })
            }

            await Category.updateOne(
                {name: name},
                {$set: { name: new_name }}
            )
            res.status(200).send({
                status: true,
                message: "Category has been updated successfully"
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

// DELETE CATEGORY
router.delete('/delete-category', async (req, res) => {
    var token = req.headers['access-token']
    let verify = verifyjwt(token)

    const name = req.body.name

    if ( verify.status != false ) {
        if ( !name ) {
            return res.send({
                status: false,
                message: "All fields are required"
            })
        }

        try {
            checkCategoryName = await Category.findOne({name})
            if ( !checkCategoryName ) {
                return res.send({
                    status: false,
                    message: "Category: " + name + " not found"
                })
            }

            await Category.deleteOne({name: name})
            Subject.schema.pre('deleteMany', next => {
                this.model('Subject').deleteMany({category: this._id}, next)
            })

            res.status(200).send({
                status: true,
                message: "Category has been deleted successfully"
            })
        } catch( err ) {
            console.log(err)
        }
    } else {
        res.send({
            verify
        })
    }
})

/*********** LESSONS **********/

// BOOK LESSONS


// RETRIEVE LESSONS


// GET A LESSON BY ID


// UPDATE A LESSON BY ID


// DELETE A LESSON BY ID


module.exports = router