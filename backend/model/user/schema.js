const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone_nr: { type: String },
  password: { type: String, required: true },
  role: {type: Number, default: 0},
  verified: {type: Boolean, default: false},
  accessToken: {type: String},
  customEmailAccept: {type: Boolean, default: true},
  quizzes: [{
    quizId: {type: Schema.Types.ObjectId,
      ref: 'Quiz'},
    questions: [{
      questionId: {type: Schema.Types.ObjectId,
        ref: 'Question'},
      answer: {type: String},
      right_answer: {type: Boolean}
    }],
    date: {type: Date, default: Date.now()}
  }]
})

userSchema.pre('save', function (next) {
  var user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return reject(err)
      resolve(isMatch)
    })
  })
}

module.exports = userSchema
