const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  title: { type: String, required: true },
  expiry_date: {type: Date}
})

module.exports = eventSchema
