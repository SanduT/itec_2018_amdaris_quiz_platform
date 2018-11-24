const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema({
  text: { type: String, required: true },
  image: { type: String },
  free_text: {type: Boolean, default: true},
  time_constraint: {type: Number},
  choices: {type: [String]},
  right_answers: {type: [Number]},
  score: {type: Number},
  categoryId: { type: Schema.Types.ObjectId,
    ref: 'categories'},
  difficulty_level: {type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
})

module.exports = questionSchema
