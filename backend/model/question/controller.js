const Controller = require('../../lib/controller')
const questionFacade = require('./facade')
const csv = require('csvtojson')
const stringSimilarity = require('string-similarity')

class QuestionController extends Controller {
  createWithSimiliarities (req, res, next) {
    const question = req.body
    const objToAdd = {

    }
    if (!question.text) { return next(new Error('No question text found.')) } else objToAdd.text = question.text

    if (question.choices && question.choices.length !== 0 && question.right_answers && question.right_answers.length !== 0) {
      objToAdd.choices = question.choices
      objToAdd.right_answers = question.right_answers
      objToAdd.free_text = false
    } else objToAdd.free_text = true

    if (question.score) {
      objToAdd.score = question.score
    }
    if (question.time_constraint) {
      objToAdd.time_constraint = question.time_constraint
    }
    if (question.image) {
      objToAdd.image = question.image
    }

    if (question.difficulty_level) {
      objToAdd.difficulty_level = question.difficulty_level
    }

    if (question.categoryId) objToAdd.categoryId = question.categoryId

    return this.facade.find({}).then((questions) => {
      let questionTexts = questions.map((question) => question.text)
      const similarity = stringSimilarity.findBestMatch(question.text, questionTexts)
      if (similarity.bestMatch.rating < 0.9) {
        req.body = objToAdd
        return this.create(req, res, next)
      } else return next(new Error(`Similar question found. similarity: ${similarity.bestMatch.rating}`))
    })
  }

  uploadPhoto (req, res, next) {
    res.status(200).json(req.file)
  }

  readCSV (req, res, next) {
    return csv({
      ignoreEmpty: true
    })
      .fromFile(req.file.path)
      .then((jsonObj) => {
        const toAddMap = jsonObj.map((question) => {
          const objToAdd = {

          }
          if (!question.Question) { return Promise.resolve() } else objToAdd.text = question.Question

          if (question.Choices && question.Answers) {
            objToAdd.choices = question.Choices.split(';')
            objToAdd.right_answers = question.Answers.split(';')
            objToAdd.free_text = false
          } else objToAdd.free_text = true

          if (question.Score) {
            objToAdd.score = question.Score
          }

          if (question.Difficulty) {
            objToAdd.difficulty_level = question.Difficulty
          }

          if (question.Time) {
            objToAdd.time_constraint = question.Time
          }
          return this.facade.find({}).then((questions) => {
            let questionTexts = questions.map((question) => question.text)
            const similarity = stringSimilarity.findBestMatch(question.Question, questionTexts)
            if (similarity.bestMatch.rating < 0.7) { return this.facade.create(objToAdd) } else return Promise.resolve()
          })
        })

        return Promise.all(toAddMap).then((resp) => res.status(200).json(resp)).catch(err => next(err))
      })
  }

  findWithQuery (req, res, next) {
    if (req.query.sort_by) {
      req.sort = true
      req.sort_by = req.query.sort_by
      delete req.query.sort_by
    } else req.sort = false

    if (req.query.text) {
      const query = req.query.text
      req.query.text = {$regex: query, $options: 'i'}
    }
    console.log(req.query)
    return this.find(req, res, next)
  }
}

module.exports = new QuestionController(questionFacade)
