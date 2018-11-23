const controller = require('./controller')
const Router = require('express').Router
const router = new Router()

router.route('/')
  .get([controller.isAdmin], (...args) => controller.find(...args))
  .post((req, res, next) => controller.register(req, res, next))

router.route('/login')
  .post((req, res, next) => controller.login(req, res, next))

router.route('/logout')
  .post((req, res, next) => controller.logout(req, res, next))

router.route('/verify/:token')
  .post((req, res, next) => controller.verifyUser(req, res, next))

router.route('/:id')
  .put([controller.isLoggedIn], (...args) => controller.updateUser(...args))
  .get([controller.isLoggedIn], (...args) => controller.findUserById(...args))
  .delete([controller.isAdmin], (...args) => controller.remove(...args))

module.exports = router
