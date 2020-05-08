const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    access_level: {
        type: String,
        default: "student"
    },

    subjects: {
        type: Array
    },

    lessons: {
        type: Array
    }
}, { timestamps: true })

module.exports = mongoose.model( 'Student', userSchema )