const Controller = require('../../lib/controller')
const categoryFacade = require('./facade')
const questionFacade = require('../question/facade')

class CategoryController extends Controller {
  findWithQuestions (req, res, next) {
    return this.facade.find({}).then((resp) => {
      return Promise.all(
        resp.map((category) => {
          req.query.categoryId = category._id
          return questionFacade.findWithQuery(req).then((childQuestions) => {
            return Promise.resolve({category, childQuestions})
          })
        })).then((categoriesWithChildren) => {
        req.query.categoryId = null
        return questionFacade.findWithQuery(req)
          .then((noCategoryChildren) => res.status(200).json({categoriesWithChildren, noCategoryChildren}))
      })
        .catch(err => next(err))
    })
  }
}

module.exports = new CategoryController(categoryFacade)
