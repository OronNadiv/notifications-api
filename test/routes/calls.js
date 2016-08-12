const info = require('debug')('ha:test:routes:calls:info')

import Call from '../../src/db/models/call'
import Chance from 'chance'
import Promise from 'bluebird'
import Request from './request'
import UserFixture from '../fixtures/user'
import 'should'

const chance = Chance()
const userFixture = new UserFixture()

let context

describe('Calls route tests', () => {
  const sid = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'})
  const sentence = chance.sentence()

  before(() => {
    return Promise
      .resolve(userFixture.create('user'))
      .then((res) => {
        context = res
        return Request
      })
      .then(req => {
        context.request = req
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
    return context.request
      .post('/calls/response')
      .set('Accept', 'application/xml')
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(404)
  })

  it('/Test calls', () => {
    return context.request
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
