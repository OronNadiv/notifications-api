import { Router } from 'express'
import _ from 'underscore'
import _str from 'underscore.string'
import Call from '../db/models/call'
import config from '../config'
import Group from '../db/models/group'
import phone from 'phone'
import postgresArray from 'postgres-array'
import Promise from 'bluebird'
import Twilio from 'twilio'
import url from 'url'

const verbose = require('debug')('ha:routes:calls:verbose')
const warn = require('debug')('ha:routes:calls:warn')
const error = require('debug')('ha:routes:calls:error')

let twilioClient

export const authenticated = new Router()
export const unauthenticated = new Router()

authenticated.post('/calls', (req, res, next) => {
  if (!config.isAlertActive.call()) {
    warn('Not making phone call')
    return res.sendStatus(204)
  }

  Promise
    .resolve(Group.forge().query(qb => {
      qb.where('id', '=', req.client.group_id)
    }).fetch())
    .then(group => {
      const from = phone(config.twilio.from)[0] || config.twilio.from
      const text = req.body.text
      const toPhones = _.chain(postgresArray.parse(group.get('phones')))
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
        twilioClient = twilioClient || new Twilio()
        return twilioClient
          .calls
          .create({
            to,
            from,
            url: url.resolve(config.serverUrl, 'calls/response')
          })
          .then(response => {
            Object.keys(response).forEach(key => {
              if (key.startsWith('_')) {
                delete response[key]
              }
            })
            verbose('Received response from twilio (after removing metadata).',
              'response:', response)

            return Call.forge()
              .save({
                from,
                to,
                sid: response.sid,
                text,
                data: response
              })
          })
      })
        .then(() => {
          res.sendStatus(204)
        })
    })
    .catch(next)
})

unauthenticated.post('/calls/response', (req, res, next) => {
  if (!config.isAlertActive.call()) {
    return next('Error: call route is called but calls is not configured.')
  }

  Call.forge()
    .query({where: {sid: req.body.CallSid}})
    .fetch()
    .then(call => {
      if (!call) {
        error('call could not be found. sid:', req.body.CallSid)
        return res.sendStatus(404)
      }

      const VoiceResponse = Twilio.twiml.VoiceResponse
      const resp = new VoiceResponse()

      verbose('req.body:', req.body)
      resp.pause({length: 2})
      resp.say({
        voice: 'woman',
        language: 'en-gb'
      }, call.get('text'))
      resp.pause({length: 2})
      resp.say({
        voice: 'woman',
        language: 'en-gb'
      }, call.get('text'))
      resp.hangup()
      const subject = resp.toString()
      verbose('sending response. subject:', subject)
      res.send(subject)
    })
    .catch(next)
})
