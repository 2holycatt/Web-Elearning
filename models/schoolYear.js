const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const schoolYearSchema = new Schema(
{
    
    schoolYear:{ 
        type: Number,
    },
    students:[{
        type: mongoose.Schema.ObjectId,
        ref: 'student'
    }],
    quizes:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
    }],
    lessonArray:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
    }],
    Assignments:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Assignment'
    }]
}, {
    timestamps: true
})

const schoolYear = mongoose.model('schoolYear', schoolYearSchema)

module.exports = schoolYear