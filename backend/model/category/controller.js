const Controller = require('../../lib/controller')
const categoryFacade = require('./facade')
const questionFacade = require('../question/facade')

class CategoryController extends Controller {
  findWithQuestions (req, res, next) {
    return this.facade.find({}).then((resp) => {
      return Promise.all(
        resp.map((category) => {
          return questionFacade.find({categoryId: category._id}).then((childQuestions) => {
            return Promise.resolve({category, childQuestions})
          })
        })).then((catetgoriesWithChildren) => questionFacade.find({categoryId: null}).then((noCategoryChildren) => res.status(200).json({catetgoriesWithChildren, noCategoryChildren})))
        .catch(err => next(err))
    })
  }
}

module.exports = new CategoryController(categoryFacade)
