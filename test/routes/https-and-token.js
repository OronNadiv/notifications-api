import Chance from 'chance'
import config from '../../config'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'
import Promise from 'bluebird'
import Request from './request'

const chance = Chance()
const shared = {}

let request

describe('token and ssl tests', () => {
  before(() => {
    config.production = true
    return Promise.resolve(Request)
      .then(req => {
        request = req
      })
      .then(() => {
        config.authPublicKey = fs.readFileSync(path.join(__dirname, '/../keys/public_key.pem'))
        shared.token = `Bearer ${jwt.sign({}, fs.readFileSync(path.join(__dirname, '/../keys/private_key.pem')), {
          algorithm: 'RS256',
          issuer: 'urn:home-automation/login',
          audience: 'urn:home-automation/*',
          subject: chance.email(),
          expiresIn: 1000
        })}`
      })
  })

  after(() => {
    config.production = false
  })

  it('/test -https -token should get 302 to https', () => {
    return request
      .get('/test')
      .set('Accept', 'application/json')
      .send()
      .expect(302)
      .then(res => {
        res.headers.location.should.startWith('https://')
      })
  })

  it('/test +https -token should get 401', () => {
    return request
      .get('/test')
      .set('Accept', 'application/json')
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(401)
  })

  it('/test -https +token should get 302 to https', () => {
    return request
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
    return request
      .get('/test')
      .set('Accept', 'application/json')
      .set('authorization', shared.token)
      .set('x-forwarded-proto', 'https')
      .send()
      .expect(404)
  })
})
