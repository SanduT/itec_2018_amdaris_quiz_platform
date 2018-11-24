const controller = require('./controller')
var multer = require('multer')
var upload = multer({ dest: 'storage/' })
const userController = require('../user/controller')

const Router = require('express').Router
const router = new Router()

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.createWithSimiliarities(...args))

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args))

router.route('/csv')
  .post([userController.isAdmin, upload.single('csvFile')], (...args) => controller.readCSV(...args))

router.route('/upload')
  .post([userController.isAdmin, upload.single('mainPhoto')], (...args) => controller.uploadPhoto(...args))
module.exports = router
