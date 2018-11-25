const controller = require('./controller')
const Router = require('express').Router
const router = new Router()

router.route('/')
  .get([controller.isAdmin], (...args) => controller.find(...args))
  .post((req, res, next) => controller.register(req, res, next))

router.route('/me')
  .get([controller.isLoggedIn], (req, res, next) => res.status(200).send(req.requestUser))

router.route('/leaderboard')
  .get([controller.isLoggedIn], (req, res, next) => controller.getLeaderbordEvents(req,res,next))

router.route('/login')
  .post((req, res, next) => controller.login(req, res, next))

router.route('/logout')
  .post((req, res, next) => controller.logout(req, res, next))

router.route('/verify')
  .post((req, res, next) => controller.verifyUser(req, res, next))

router.route('/submitquiz')
  .post([controller.isLoggedIn],(req, res, next) => controller.submitQuiz(req, res, next))

router.route('/:id')
  .put([controller.isLoggedIn], (...args) => controller.updateUser(...args))
  .get([controller.isLoggedIn], (...args) => controller.findUserById(...args))
  .delete([controller.isAdmin], (...args) => controller.remove(...args))

module.exports = router
