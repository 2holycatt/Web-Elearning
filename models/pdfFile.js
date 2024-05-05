const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const pdfFileSchema = new Schema({
    name:{
        type: 'string',
        default: 'Layout05'
    },
    MainDescription: {
        type: String,
    },
    PdfFile : {
        filename: String,
        content: Buffer
    },
    LessonArrayObject:[
        {
            LessonId: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            }
        }
    ]
}, { timestamps: true });

const pdfFile = mongoose.model('pdfFile', pdfFileSchema)

module.exports = pdfFile