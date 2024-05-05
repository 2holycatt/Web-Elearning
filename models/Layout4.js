const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Layout4Schema = new Schema({
  name: {
    type: 'string',
    default: 'Layout04'
  },
  Topic: {
    type: String,
  },
  Description: {
    type: String,

  },
  Lists:[{
    list:{
      type: String
    }
  }],
  LessonArrayObject: [
    {
      LessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    }
  ],
}, { timestamps: true });

const Layout4 = mongoose.model('Layout4s', Layout4Schema);

module.exports = Layout4;
