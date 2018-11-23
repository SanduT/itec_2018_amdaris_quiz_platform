const Router = require('express').Router
const router = new Router()

const user = require('./model/user/router')
const quiz = require('./model/quiz/router')
const event = require('./model/event/router')
const question = require('./model/question/router')
const category = require('./model/category/router')

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to itec2018-quiz-platform API!' })
})

router.use('/user', user)
router.use('/quiz', quiz)
router.use('/event', event)
router.use('/question', question)
router.use('/category', category)

module.exports = router
