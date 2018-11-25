const Controller = require('../../lib/controller')
const userFacade = require('./facade')
const crypto = require('crypto')
const mailSender = require('../../services/mailSender')
class UserController extends Controller {
  register (req, res, next) {
    return this.facade.findOne({ $or: [{ email: req.body.email }] }).then((exists) => {
      if (!exists) {
        delete req.role
        req.body.accessToken = crypto.randomBytes(16).toString('hex')
        return this.facade.create(req.body).then((user) => {
          return mailSender.sendInviteEmail(user).then((resp) => {
            return res.status(200).json(resp)
          })
        })
      } else return next(new Error('User already exists'))
    })
  }

  login (req, res, next) {
    const attempt = req.body
    return this.facade.findOne({ email: attempt.email, verified: true }).then((user) => {
      if (!user) return next(new Error('Wrong Credentials'))
      return user.comparePassword(attempt.password).then((isMatch) => {
        if (!isMatch) return next(new Error('Wrong Credentials'))
        else {
          req.session.auth = user._id
          return res.status(200).json(user)
        }
      }).catch(err => next(err))
    }).catch(err => next(err))
  }

  logout (req, res, next) {
    delete req.session.auth
    return res.status(200).json()
  }

  isAdmin (req, res, next) {
    if (!req.session.auth) { return next(new Error('Unathorized')) } else {
      return userFacade.findOne({ _id: req.session.auth, verified: true }).then((user) => {
        if (!user) return next(new Error('Unathorized'))
        req.requestUser = user
        if (user.role === 1) { return next() } else return next(new Error('Unathorized'))
      })
    }
  }

  isLoggedIn (req, res, next) {
    if (!req.session.auth) { return next(new Error('Unathorized')) } else {
      return userFacade.findOne({ _id: req.session.auth, verified: true }).then((user) => {
        if (!user) return next(new Error('Unathorized'))
        req.requestUser = user
        if (user) { return next() } else return next(new Error('Unathorized'))
      })
    }
  }

  updateUser (req, res, next) {
    if (req.requestUser._id.toString() === req.params.id || req.requestUser.role === 1) { return this.update(req, res, next) } else return next(new Error('Unathorized'))
  }
  findUserById (req, res, next) {
    if (req.requestUser._id.toString() === req.params.id || req.requestUser.role === 1) { return this.findById(req, res, next) } else return next(new Error('Unathorized'))
  }

  verifyUser (req, res, next) {
    if (!req.body.token) return next(new Error('No such User!'))
    this.facade.findOne({accessToken: req.body.token}).then((user) => {
      if (!user) {
        return next(new Error('No such User!'))
      } else {
        req.params.id = user._id
        req.body = {
          verified: true,
          accessToken: null
        }
        return this.update(req, res, next)
      }
    })
  }

  submitQuiz (req,res,next) {
    const to_push = {
      quizId:req.body.quizId,
      questions:req.body.questions
    }
    return this.facade.Model.updateOne({_id:req.requestUser._id},{$push:{quizzes:to_push}}).then((resp)=>{
      return res.status(200).json(resp)
    }).catch(next)
  }



  getLeaderbordEvents(req,res,next) {

    const getLeaderboard = (quizzid) => new Promise((resolve,reject) =>
    userFacade.Model.find({'quizzes.quizId':quizzid}).populate('quizzes.questions.questionId').populate('quizzes.quizId').lean().then((users)=>{
      const leaderBoard = users.map((user)=>{
        var score = 0
        
        const right_quiz = user.quizzes.filter((quiz)=>quiz.quizId._id && quiz.quizId._id == String(quizzid))[0]
        right_quiz.questions.map((question)=>{
          if(question.right_answer)
          {
            score+=question.questionId.difficulty_level
          }
        })
        return {
          userName:user.name,
          userId:user._id,
          score:score,
          quizTitle:right_quiz.quizId.title
        }
      })
      resolve(leaderBoard)
    }).catch(err=>reject(err)))

    Promise.all(req.requestUser.quizzes.map((quiz)=>getLeaderboard(quiz.quizId))).then((resp)=>{
      res.status(200).send(resp)
    }).catch(next)

  }
  
}

module.exports = new UserController(userFacade)
