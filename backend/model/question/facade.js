const Facade = require('../../lib/facade')
const questionSchema = require('./schema')

class QuestionFacade extends Facade {
  findWithQuery (req) {
    if (req.query.filter_by) {
      switch (req.query.filter_by) {
        case 'multiple_answer':
          req.query.multiple_answer = true
          break
        case 'single_answer':
          req.query.multiple_answer = true
          break
        case 'free_text':
          req.query.free_text = true
          break
        case 'scored':
          req.query.scored = true
          break
        case 'time_constrained':
          req.query.time_constrained = true
          break
      }
      delete req.query.filter_by
    }
    if (req.query.categoryId === 'null') {
      req.query.categoryId = null
    }
    if (req.query.sort_by) {
      req.sort = true
      req.sort_by = req.query.sort_by
      delete req.query.sort_by
    } else req.sort = false

    if (req.query.textregex) {
      const query = req.query.textregex
      req.query.text = {$regex: query, $options: 'i'}
      delete req.query.textregex
    }
    if (req.sort) {
      return this.Model.find(req.query).sort({ [req.sort_by]: 1 })
    } else {
      return this.find(req.query)
    }
  }
}

module.exports = new QuestionFacade('Question', questionSchema)
