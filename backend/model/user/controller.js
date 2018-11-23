const Controller = require('../../lib/controller')
const userFacade = require('./facade')

class UserController extends Controller {
  register (req, res, next) {
    return this.facade.findOne({$or: [{email: req.body.email}]}).then((exists) => {
      if (!exists) {
        delete req.role
        return this.create(req, res, next)
      } else return next(new Error('User already exists'))
    })
  }

  login (req, res, next) {
    const attempt = req.body
    return this.facade.findOne({ email: attempt.email }).then((user) => {
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
    if (!req.session.auth) { next(new Error('Unathorized')) } else {
      return userFacade.findOne({_id: req.session.auth}).then((user) => {
        req.requestUser = user
        if (user.role === 1) { return next() } else return next(new Error('Unathorized'))
      })
    }
  }

  isLoggedIn (req, res, next) {
    if (!req.session.auth) { next(new Error('Unathorized')) } else {
      return userFacade.findOne({_id: req.session.auth}).then((user) => {
        req.requestUser = user
        if (user) { return next() } else return next(new Error('Unathorized'))
      })
    }
  }

  updateUser (req, res, next) {
    if (req.requestUser._id.toString() === req.params.id || req.requestUser.role === 1) { this.update(req, res, next) } else return next(new Error('Unathorized'))
  }
  findUserById (req, res, next) {
    if (req.requestUser._id.toString() === req.params.id || req.requestUser.role === 1) { this.findById(req, res, next) } else return next(new Error('Unathorized'))
  }
}

module.exports = new UserController(userFacade)
