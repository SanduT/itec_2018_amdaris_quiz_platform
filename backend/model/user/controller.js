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
    this.facade.findOne({accessToken: req.params.token}).then((user) => {
      if (!user) {
        return next(new Error('No such User!'))
      } else {
        req.params.id = user._id
        req.body = {
          verified: true
        }
        return this.update(req, res, next)
      }
    })
  }
}

module.exports = new UserController(userFacade)
