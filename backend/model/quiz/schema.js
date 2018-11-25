const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema({
  title: { type: String, required: true },
  scored: { type: Boolean, default: false },
  time_limit: { type: Boolean, default: false },
  max_time_allowed: { type: Number },
  rules: [{
    rule_type: {type: String, enum: ['question', 'category']},
    id: {type: String},
    no: {type: Number},
    difficulty_level: {type: [Number]}
  }],
  eventId: { type: Schema.Types.ObjectId,
    ref: 'events',
    required: true }
})

module.exports = quizSchema
