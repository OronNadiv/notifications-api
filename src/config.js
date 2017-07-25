import fs from 'fs'
import knexPgCustomSchema from 'knex-pg-customschema'
import path from 'path'

const error = require('debug')('ha:config:error')

const config = {production: process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION'}

config.authPublicKey = process.env.AUTH_PUBLIC_KEY || (config.production ? null : fs.readFileSync(path.join(__dirname, '../test/keys/public_key.pem')))
if (!config.authPublicKey) {
  error(
    'Login public key could not be found in the environment variable.  Please set \'AUTH_PUBLIC_KEY\'.'
  )
  process.exit(1)
}

config.mailgun = {
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  sender: process.env.EMAIL_ALERT_SENDER,
  sendEmail: (process.env.SEND_EMAIL || 'true').toLowerCase() !== 'false'
}

config.port = process.env.PORT || 3004

config.postgres = process.env.DATABASE_URL || 'postgres://postgres:@localhost/home_automation'
config.postgresPool = {
  min: parseInt(process.env.POSTGRESPOOLMIN || 2, 10),
  max: parseInt(process.env.POSTGRESPOOLMAX || 10, 10),
  log: process.env.POSTGRESPOOLLOG === 'true',
  afterCreate: knexPgCustomSchema('notifications')
}

config.serverUrl = process.env.SERVER_URL || (config.production ? null : `http://localhost:${config.port}`)
if (!config.serverUrl) {
  error(
    'Server URL could not be found in the environment variable.  Please set \'SERVER_URL\'.'
  )
  process.exit(1)
}

config.skipSSL = process.env.SKIP_SSL && process.env.SKIP_SSL.toUpperCase() === 'TRUE'

config.twilio = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  from: process.env.TWILIO_FROM,
  to: process.env.TWILIO_TO,
  sendSMS: (process.env.SEND_SMS || 'true').toLowerCase() !== 'false',
  makeCall: (process.env.MAKE_CALL || 'true').toLowerCase() !== 'false'
}

config.isAlertActive = {
  call () {
    return config.twilio.accountSid && config.twilio.authToken && config.twilio.from && config.serverUrl && config.twilio.makeCall
  },
  sms () {
    return config.twilio.accountSid && config.twilio.authToken && config.twilio.from && config.twilio.sendSMS
  },
  email () {
    return config.mailgun.apiKey && config.mailgun.domain && config.mailgun.sender && config.mailgun.sendEmail
  }
}

export default config
