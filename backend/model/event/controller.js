const Controller = require('../../lib/controller')
const eventFacade = require('./facade')
const quizFacade = require('../quiz/facade')
class EventController extends Controller {
  findWithQuizez (req, res, next) {
    this.facade.find({}).then((resp) => {
      return Promise.all(
        resp.map((event) => {
          req.query.eventId = event._id
          return quizFacade.find(req.query).then((childQuiz) => {
            return Promise.resolve({event, childQuiz})
          })
        })).then((categoriesWithChildren) => res.status(200).send(categoriesWithChildren))
    }).catch(next)
  }
}

module.exports = new EventController(eventFacade)
