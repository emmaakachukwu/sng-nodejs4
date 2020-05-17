const mongoose = require("mongoose")
const Schema = mongoose.Schema

const lessonSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },

    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor'
    },

    time_booked: {
        type: Date,
        default: Date.now()
    }
    
}, { timestamps: true })

module.exports = mongoose.model( 'Lesson', lessonSchema )