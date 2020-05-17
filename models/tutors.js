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
        default: "tutor"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }]

}, { timestamps: true })

module.exports = mongoose.model( 'Tutor', userSchema )