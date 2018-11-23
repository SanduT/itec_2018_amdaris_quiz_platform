const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema({
  text: { type: String, required: true }
})

module.exports = quizSchema
