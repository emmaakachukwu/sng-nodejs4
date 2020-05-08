const mongoose = require("mongoose")
const Schema = mongoose.Schema

const lessonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    }
}, { timestamps: true })

module.exports = mongoose.model( 'Lesson', lessonSchema )