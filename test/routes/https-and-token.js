import config from '../../src/config'
import Promise from 'bluebird'
import Request from './request'
import UserFixture from '../fixtures/user'

const shared = {}
const userFixture = new UserFixture()

let context

describe('token and ssl tests', () => {
  before(() => {
    config.production = true
    return Promise
      .resolve(userFixture.create('user'))
      .then((res) => {
        context = res
        return Request
      })
      .then(req => {
        context.request = req
      })
  })

  after(() => {
    config.production = false
  })

  it('/test -https -token should get 302 to https', () => {
    return context.request
      .get('/test')
      .set('Accept', 'application/json')
      .send()
      .expect(302)
      .then(res => {
        res.headers.location.should.startWith('https://')
      })
  })

  it('/test +https -token should get 401', () => {
    return context.request
      .get('/test')
      .set('Accept', 'application/json')
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(401)
  })

  it('/test -https +token should get 302 to https', () => {
    return context.request
      .get('/test')
      .set('Accept', 'application/json')
      .set('authorization', shared.token)
      .send()
      .expect(302)
      .then(res => {
        res.headers.location.should.startWith('https://')
      })
  })

  it('/test +https +token should get 404', () => {
    return context.request
      .get('/test')
      .set('Accept', 'application/json')
      .set('authorization', shared.token)
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(404)
  })
})
