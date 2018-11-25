const Controller = require('../../lib/controller')
const quizFacade = require('./facade')
const questionFacade = require('../question/facade')
const mongoose = require('mongoose')
class QuizController extends Controller {
  checkIfPossible (req, res, next) {
    const possibilities = req.body.rules

    let existingQuestions = []
    let existingCategoriesId = []
    let existingCategories = []

    const checkCategory = (id, difficulty, no) =>
      new Promise((resolve, reject) => {
        if (existingCategoriesId.includes(id)) return reject(new Error('This category already exists'))
        return questionFacade.find({categoryId: mongoose.Types.ObjectId(id), difficulty_level: difficulty}).then((quest) => {
          let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
          if (availableQuests.length >= no) {
            existingCategoriesId.push(id)
            existingCategories.push({
              id: id,
              quests_available: availableQuests.length,
              no: no
            })
            return resolve('Everything OK')
          } else reject(new Error(`Not enough questions availabe for category, ${availableQuests.length} available`))
        }).catch(err => reject(err))
      })

    const checkQuestion = (id) =>
      new Promise((resolve, reject) => {
        if (!id || id === '') return reject(new Error('Question not selected'))
        if (existingQuestions.includes(id)) { return reject(new Error('Question already used')) } else {
          return questionFacade.findById(id).then((question) => {
            if (!question.categoryId || question.categoryId === null) { existingQuestions.push(id); return resolve() }
            if (existingCategoriesId.includes(question.categoryId.toString())) {
              let category = existingCategories.find((cat) => cat.id === question.categoryId.toString())
              if (category.quests_available > category.no) {
                existingQuestions.push(id)
                category.quests_available--
                return resolve()
              } else reject(new Error("Adding the question isn't possible since it has already been added with a category"))
            } else { existingQuestions.push(id); resolve() }
          })
        }
      })

    const checkPossibilities = (index) => {
      if (index === possibilities.length) return res.status(200).json()
      else {
        const possibility = possibilities[index]
        if (possibility.rule_type === 'question') {
          checkQuestion(possibility.id).then(() => {
            checkPossibilities(++index)
          }).catch(next)
        } else {
          checkCategory(possibility.id, possibility.difficulty_level, possibility.no).then(() => {
            checkPossibilities(++index)
          }).catch(next)
        }
      }
    }

    checkPossibilities(0)
  }
}

module.exports = new QuizController(quizFacade)
