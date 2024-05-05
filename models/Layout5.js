const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Layout5Schema = new Schema({
    name: {
        type: 'string',
        default: 'Layout05'
    },
    MainDescription: {
        type: String
    },
    LessonArrayObject: [
        {
            LessonId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            }
        }
    ],
    fileName: {
        type: String
    },
    file: {
        type: String,
        required: [true, "Please provide a file"],
    }

}, { timestamps: true });

const Layout5 = mongoose.model('Layout5s', Layout5Schema)

module.exports = Layout5