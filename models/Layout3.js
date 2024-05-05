const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Layout3Schema = new Schema({
  name: {
    type: 'string',
    default: 'Layout03'
  },
  Description: {
    type: String,
  },
  File: {
    data: Buffer,
    metadata: {
      contentType: String,
      size: Number,
    }
  },
  LessonArrayObject: [
    {
      LessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    }
  ],
}, { timestamps: true });

const Layout3 = mongoose.model('Layout3s', Layout3Schema);

module.exports = Layout3;
