const Controller = require('../../lib/controller')
const quizFacade = require('./facade')

class QuizController extends Controller {}

module.exports = new QuizController(quizFacade)
