const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema({
  title: { type: String, required: true },
  scored: { type: Boolean, default: false },
  time_limit: { type: Boolean, default: false },
  max_time_allowed: { type: Number },
  rules: {
    questions: [{
      questionId: { type: Schema.Types.ObjectId,
        ref: 'questions' },
      index: {type: Number}
    }],
    categories: [{
      categoryId: { type: Schema.Types.ObjectId,
        ref: 'categories'},
      index: {type: Number},
      questions_no: {type: Number},
      difficulties: {type: [Number]}
    }]
  },
  eventId: { type: Schema.Types.ObjectId,
    ref: 'events',
    required: true }
})

module.exports = quizSchema
