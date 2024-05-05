const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    LessonName: {
        type: String,

    },
    LessonImage: {
        data: {
            type: Buffer,
            default: null
        },
        contentType: {
            type: String,
            default: null
        }
    },
    LayOut1ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout1',
    }],
    LayOut2ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout2',
    }],
    LayOut3ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout3',
    }],
    LayOut4ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout4',
    }],
    LayOut5ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout5',
    }],
    schoolYear:{
        type: mongoose.Schema.ObjectId,
        ref: 'schoolYear'
    }
}, { timestamps: true });

const Lesson = mongoose.model('lessons', lessonSchema)

module.exports = Lesson