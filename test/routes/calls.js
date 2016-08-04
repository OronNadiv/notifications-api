const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('../../logger')
const info = log.info.bind(log, LOG_PREFIX)

import Call from '../../db/models/call'
import Chance from 'chance'
import Promise from 'bluebird'
import Request from './request'
import 'should'

const chance = Chance()

let request

describe('Calls route tests', () => {
  const sid = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'})
  const sentence = chance.sentence()

  before(() => {
    return Promise.resolve(Request)
      .then(req => {
        request = req
      })
      .then(() => {
        return Call.forge().save({
          from: chance.phone(),
          to: chance.phone(),
          sid: sid,
          text: sentence,
          data: {sid: sid}
        })
      })
  })

  it('/Test calls - wrong sid', () => {
    return request
      .post('/calls/response')
      .set('Accept', 'application/xml')
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(404)
  })

  it('/Test calls', () => {
    return request
      .post('/calls/response')
      .set('Accept', 'application/xml')
      .set('x-forwarded-proto', 'https')
      .send({
        CallSid: sid
      })
      .expect(200)
      .then(res => {
        res.text.should.equal(
          `<?xml version="1.0" encoding="UTF-8"?><Response><Pause length="2"></Pause><Say voice="woman" language="en-gb">${sentence}</Say><Pause length="2"></Pause><Say voice="woman" language="en-gb">${sentence}</Say><Hangup></Hangup></Response>`
        )
        info(res)
      })
  })
})
