const controller = require('./controller')
const userController = require('../user/controller')

const Router = require('express').Router
const router = new Router()

router.route('/')
  .get([userController.isAdmin], (...args) => controller.findWithQuestions(...args))
  .post([userController.isAdmin], (...args) => controller.create(...args))

router.route('/:id')
  .put([userController.isAdmin], (...args) => controller.update(...args))
  .get([userController.isAdmin], (...args) => controller.findById(...args))
  .delete([userController.isAdmin], (...args) => controller.remove(...args))

module.exports = router
