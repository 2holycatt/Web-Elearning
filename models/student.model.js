const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const studentSchema = new Schema(
{
    schoolId:{
        type: 'string',
    },
    yearLevel:{ 
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    notification:{
        type: mongoose.Schema.ObjectId,
        ref: 'Notification'
    },
    quizes:{
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
    },
    lessonArray:{
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
    },
    comments:{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    logsFiles:{
        type: mongoose.Schema.ObjectId,
        ref: 'LogsFile'
    },
    schoolYear:{
        type: mongoose.Schema.ObjectId,
        ref: 'schoolYear'
    },
}, {
    timestamps: true
}
)

const Student = mongoose.model('Student', studentSchema)

module.exports = Student