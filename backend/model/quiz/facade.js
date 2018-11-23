const Facade = require('../../lib/facade')
const quizSchema = require('./schema')

class QuizFacade extends Facade {}

module.exports = new QuizFacade('Quiz', quizSchema)
