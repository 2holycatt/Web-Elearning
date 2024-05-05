const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Layout2Schema = new Schema({
    name:{
        type: 'string',
        default: 'Layout02'
    },
    Topic: {
        type: String,
    },
    TextArea1: {
        type: String,
    },
    TextArea2: {
        type: String,
    },
    TextArea3:{
        type: String,
    },
    LessonArrayObject:[
        {
            LessonId: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            }
        }
    ],
}, { timestamps: true });

const Layout2 = mongoose.model('Layout2s', Layout2Schema)

module.exports = Layout2