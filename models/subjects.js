const mongoose = require("mongoose")
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },

    lessons: [{
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    }]
}, { timestamps: true })

module.exports = mongoose.model( 'Subject', subjectSchema )