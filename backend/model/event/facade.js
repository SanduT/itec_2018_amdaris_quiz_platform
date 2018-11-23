const Facade = require('../../lib/facade')
const eventSchema = require('./schema')

class EventFacade extends Facade {}

module.exports = new EventFacade('Event', eventSchema)
