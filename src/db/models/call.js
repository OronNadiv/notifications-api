const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('../../logger')
const verbose = log.verbose.bind(log, LOG_PREFIX)
const warn = log.warn.bind(log, LOG_PREFIX)

import _ from 'underscore'
import _str from 'underscore.string'
import Bookshelf from '../bookshelf'
import config from '../../config'
import phone from 'phone'
import Promise from 'bluebird'
import Twillio from 'twilio'
import url from 'url'

const call = Bookshelf.Model.extend({
  tableName: 'calls',
  hasTimestamps: true
})

call.make = text => {
  if (!config.isAlertActive.call()) {
    warn('Not making phone call')
    return
  }
  const from = phone(config.twilio.from)[0] || config.twilio.from
  let toPhones = _str.words(config.twilio.to, ',')
  toPhones = _.chain(toPhones)
    .map(to => {
      return _str.trim(to)
    })
    .map(to => {
      return phone(to)[0] || to
    })
    .value()

  // API doc: https://www.twilio.com/docs/api/rest/making-calls
  return Promise.map(toPhones, to => {
    verbose('Firing request to twilio.')
    return Twillio().makeCall({
      to: to,
      from: from,
      url: url.resolve(config.serverUrl, 'calls'),
      record: false
    })
      .then(response => {
        verbose('Received response from twilio. to:', to, 'response:', response)
        return call.forge()
          .save({
            from: from,
            to: to,
            sid: response.sid,
            text: text,
            data: response
          })
      })
  })
}

export default call
