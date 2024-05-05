var mongoose = require('mongoose')
var quizSchema = mongoose.Schema({
    quizname: {
        type: String,
        required: true
    },
    quizdescription: {
        type: String,
        required: true
    },
    upload:{
        type: Boolean, default: false
    },
    owner: {
        type: String,
    },
    owneremail: {
        type: String,
    },
    quizImage: {
        data: {
            type: Buffer,
            default: null
        },
        contentType: {
            type: String,
            default: null
        }
    },
    question1ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question1',
    }],
    question2ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question2',
    }],
    question3ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question3',
    }],
    question4ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question4',
    }]

})
module.exports = mongoose.model('Quiz',quizSchema)