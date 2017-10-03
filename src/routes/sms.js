import { Router } from 'express'
import _ from 'underscore'
import _str from 'underscore.string'
import config from '../config'
import Group from '../db/models/group'
import phone from 'phone'
import postgresArray from 'postgres-array'
import Promise from 'bluebird'
import Twilio from 'twilio'

const verbose = require('debug')('ha:routes:sms:verbose')
const warn = require('debug')('ha:routes:sms:warn')

const client = new Twilio()
const router = new Router()

router.post('/sms', (req, res, next) => {
  if (!config.isAlertActive.sms()) {
    warn('Not making phone call')
    return res.sendStatus(204)
  }

  Promise
    .resolve(Group.forge().query(qb => {
      qb.where('id', '=', req.client.group_id)
    }).fetch())
    .then(group => {
      const from = phone(config.twilio.from)[0] || config.twilio.from
      const toPhones = _.chain(postgresArray.parse(group.get('phones')))
        .map(to => {
          return _str.trim(to)
        })
        .map(to => {
          return phone(to)[0] || to
        })
        .value()

      return Promise
        .map(toPhones, to => {
          // https://www.twilio.com/docs/api/rest/sending-sms
          verbose('Firing request to twilio. from:', from, 'to:', to)
          return client.messages
            .create({
              to: to,
              from: from,
              body: req.body.text
            })
            .then(response => {
              verbose('Received response from twilio. to:', to, 'response:', response)
            })
        })
        .then(() => {
          res.sendStatus(204)
        })
    })
    .catch(next)
})

export default router
