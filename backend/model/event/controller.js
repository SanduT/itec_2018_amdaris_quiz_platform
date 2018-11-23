const Controller = require('../../lib/controller')
const eventFacade = require('./facade')

class EventController extends Controller {}

module.exports = new EventController(eventFacade)
