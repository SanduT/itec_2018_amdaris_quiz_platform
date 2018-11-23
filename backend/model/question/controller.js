const Controller = require('../../lib/controller')
const questionFacade = require('./facade')

class QuestionController extends Controller {
  uploadPhoto (req, res, next) {
    res.status(200).json(req.files)
  }
}

module.exports = new QuestionController(questionFacade)
