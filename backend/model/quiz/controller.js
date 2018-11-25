const Controller = require('../../lib/controller')
const quizFacade = require('./facade')
const questionFacade = require('../question/facade')
const qr = require('qr-image');  
const mongoose = require('mongoose')
class QuizController extends Controller {
  checkIfPossible (req, res, next) {
    const possibilities = req.body.rules

    let existingQuestions = []
    let existingCategoriesId = []
    let existingCategories = []

    const checkCategory = (id, difficulty, no) =>
      new Promise((resolve, reject) => {
        if (!difficulty || difficulty === null) {
          if (existingCategoriesId.includes(id)) return reject(new Error('This category already exists'))
          return questionFacade.find({categoryId: mongoose.Types.ObjectId(id)}).then((quest) => {
            let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
            if (availableQuests.length >= no) {
              existingCategoriesId.push(id)
              existingCategories.push({
                id: id,
                quests_available: availableQuests.length,
                no: no
              })
              return resolve('Everything OK')
            } else reject(new Error(`Not enough questions available for category, ${availableQuests.length} available`))
          }).catch(err => reject(err))
        } else {
          if (existingCategoriesId.includes(id) && existingCategories.filter((cat) => cat.id === id).map((cat) => cat.difficulty_level).includes(difficulty)) return reject(new Error('This category already exists'))
          return questionFacade.find({categoryId: mongoose.Types.ObjectId(id), difficulty_level: difficulty}).then((quest) => {
            let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
            if (availableQuests.length >= no) {
              existingCategoriesId.push(id)
              existingCategories.push({
                id: id,
                quests_available: availableQuests.length,
                difficulty_level: difficulty,
                no: no
              })
              return resolve('Everything OK')
            } else reject(new Error(`Not enough questions availabe for category, ${availableQuests.length} available`))
          }).catch(err => reject(err))
        }
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

  generateQuiz (req, res, next) {
    if (req.requestUser.quizzes.map((quizz) => quizz.quizzId).includes(req.params.quizzid)) { return next(new Error('User already completed quiz')) } else {
      return this.facade.findById(req.params.quizzid).then((quiz) => {
        let possibilities = quiz.rules

        let existingQuestions = []
        let existingCategoriesId = []
        let existingCategories = []
        let questionsToShow = []

        const checkCategory = (id, difficulty, no) =>
          new Promise((resolve, reject) => {
            if (!difficulty || difficulty === null) {
              if (existingCategoriesId.includes(id)) return reject(new Error('This category already exists'))
              return questionFacade.find({categoryId: mongoose.Types.ObjectId(id)}).then((quest) => {
                let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
                if (availableQuests.length >= no) {
                  existingCategoriesId.push(id)
                  existingCategories.push({
                    id: id,
                    quests_available: availableQuests.length,
                    quests_to_show: availableQuests,
                    no: no
                  })
                  return resolve('Everything OK')
                } else reject(new Error(`Not enough questions available for category, ${availableQuests.length} available`))
              }).catch(err => reject(err))
            } else {
              if (existingCategoriesId.includes(id) && existingCategories.filter((cat) => cat.id === id).map((cat) => cat.difficulty_level).includes(difficulty)) return reject(new Error('This category already exists'))
              return questionFacade.find({categoryId: mongoose.Types.ObjectId(id), difficulty_level: difficulty}).then((quest) => {
                let availableQuests = quest.filter((q) => !existingQuestions.includes(q._id))
                if (availableQuests.length >= no) {
                  existingCategoriesId.push(id)
                  existingCategories.push({
                    id: id,
                    quests_available: availableQuests.length,
                    quests_to_show: availableQuests,
                    difficulty_level: difficulty,
                    no: no
                  })
                  return resolve('Everything OK')
                } else reject(new Error(`Not enough questions availabe for category, ${availableQuests.length} available`))
              }).catch(err => reject(err))
            }
          })

        const checkQuestion = (id) =>
          new Promise((resolve, reject) => {
            if (!id || id === '') return reject(new Error('Question not selected'))
            if (existingQuestions.includes(id)) { return reject(new Error('Question already used')) } else {
              return questionFacade.findById(id).then((question) => {
                if (!question.categoryId || question.categoryId === null) { existingQuestions.push(id); questionsToShow.push(question); return resolve() }
                if (existingCategoriesId.includes(question.categoryId.toString())) {
                  let category = existingCategories.find((cat) => cat.id === question.categoryId.toString())
                  if (category.quests_available > category.no) {
                    existingQuestions.push(id)
                    category.quests_available--
                    category.quests_to_show.filter((q) => q._id !== id)
                    questionsToShow.push(question)
                    return resolve()
                  } else reject(new Error("Adding the question isn't possible since it has already been added with a category"))
                } else { existingQuestions.push(id); questionsToShow.push(question); resolve() }
              })
            }
          })

        const checkPossibilities = (index) => {
          if (index === possibilities.length) {
            function getRandom (arr, n) {
              var result = new Array(n),
                len = arr.length,
                taken = new Array(len)
              if (n > len) { throw new RangeError('getRandom: more elements taken than available') }
              while (n--) {
                var x = Math.floor(Math.random() * len)
                result[n] = arr[x in taken ? taken[x] : x]
                taken[x] = --len in taken ? taken[len] : len
              }
              return result
            }

            let results = existingCategories.map((cat) => getRandom(cat.quests_to_show, cat.no))
            results.push(questionsToShow)
            return res.status(200).json([].concat(...results))
          } else {
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
      })
    }

  }

  generateQR(req,res,next) {
    var code = qr.image("https://quizzard.club/quiz/"+req.params.quizzid, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
  }
}

module.exports = new QuizController(quizFacade)
