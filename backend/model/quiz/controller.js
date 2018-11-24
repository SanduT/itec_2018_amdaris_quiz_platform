const Controller = require('../../lib/controller')
const quizFacade = require('./facade')
const questionFacade = require('../question/facade')
const mongoose = require('mongoose')
class QuizController extends Controller {
  checkIfPossible (req, res, next) {
    const possibilities = req.body.items
    let existingQuestions = []
    let existingCategoriesId = []
    let existingCategories = []

    const checkCategory = (id, difficulty, no) =>
      new Promise((resolve, reject) => {
        if (existingCategoriesId.includes(id)) return reject(new Error('This category already exists'))
        return questionFacade.find({categoryId: mongoose.Types.ObjectId(id), difficulty_level: {$in: difficulty}}).then((quest) => {
          let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
          if (availableQuests.length >= no) {
            existingQuestions.push(availableQuests.map((q) => q._id))
            existingCategoriesId.push(id)
            existingCategories.push({
              id: id,
              availableQuests: availableQuests,
              no: no
            })
            return resolve('Everything OK')
          } else reject(new Error(`Not enough questions availabe for ${id}, ${availableQuests.length} available`))
        }).catch(err => reject(err))
      })

    const checkPossibilities = (index) => {
      const possibility = possibilities[index]
      if (possibility.type === 'question') {
        console.log(existingQuestions)
        if (!existingQuestions.includes(possibility.id)) {
          existingQuestions.push(possibility.id)
          if (index === this.checkIfPossible.length) res.status(200).json()
          else { checkPossibilities(++index) }
        } else return next(new Error('Question already added'))
      } else {
        checkCategory(possibility.id, possibility.difficulties, possibility.no).then(() => {
          if (index === this.checkIfPossible.length) res.status(200).json()
          else { checkPossibilities(++index) }
        }).catch(next)
      }
    }

    checkPossibilities(0)
  }
}

module.exports = new QuizController(quizFacade)
