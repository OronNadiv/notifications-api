const path = require('path')
const LOG_PREFIX = `"${path.basename(__filename)}":`
const log = require('../logger')
const verbose = log.verbose.bind(log, LOG_PREFIX)
const info = log.info.bind(log, LOG_PREFIX)
const error = log.error.bind(log, LOG_PREFIX)

import {authenticated, unauthenticated} from './../routes/calls'
import authToken from './../middleware/auth_token'
import bodyParser from 'body-parser'
import config from './../config'
import cookieParser from 'cookie-parser'
import diehard from 'diehard'
import emails from './../routes/emails'
import express from 'express'
import ping from './../middleware/ping'
import Promise from 'bluebird'
import redirectToHttps from './../middleware/redirect_to_https'
import sms from './../routes/sms'
import xHeaders from './../middleware/x_headers'

const app = express()

export default {
  initialize () {
    return new Promise(resolve => {
      app.use('/ping', ping)
      app.use(redirectToHttps)
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({extended: true}))

      app.use(unauthenticated)

      app.use(cookieParser())

      app.use(authToken)
      app.use(xHeaders)

      app.use(authenticated)
      app.use(emails)
      app.use(sms)

      app.use((err, req, res) => {
        if (!(err instanceof Error)) {
          // req is actually res.
          error('unknown request.  See logs for more details.')
          return req.sendStatus(404)
        }
        error('sending Error.  Err: ', err)
        return res.sendStatus(err.status || 500)
      })

      const server = app.listen(config.port, () => {
        info(`Express server listening on port ${server.address().port}`)

        diehard.register(done => {
          verbose('Shutting down http server')
          server.close(() => {
            verbose('Http server was shutdown successfully.')
            done()
          })
        })

        resolve({server: server, express: app})
      })
    })
  }
}
