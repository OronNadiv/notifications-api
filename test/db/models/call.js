import Chance from 'chance'
import nock from 'nock'
import Call from '../../../src/db/models/call'
import config from '../../../src/config'

const chance = Chance()

describe('Call Model', () => {
  before(() => {
    config.twilioAccountSid = 'fake twilio account sid'
    config.twilioAuthToken = 'fake twilio auth token'

    const from = chance.phone()
    const to = `${chance.phone()} , ${chance.phone()} , ${chance.phone()} , ${chance.phone()}`
    const callSid = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'})

    nock('https://api.twilio.com:443')
      .filteringPath(() => {
        return `/2010-04-01/Accounts/${config.twilioAccountSid}/OutgoingCallerIds.json`
      })
      .post(`/2010-04-01/Accounts/${config.twilioAccountSid}/OutgoingCallerIds.json`)
      .reply(201, () => {
        /* {
         sid: 'YYY',
         date_created: null,
         date_updated: null,
         parent_call_sid: null,
         account_sid: 'XXX',
         to: '+14152341234',
         to_formatted: '(415) 234-1234',
         from: '+14152341234',
         from_formatted: '(415) 234-1234',
         phone_number_sid: 'ZZZ',
         status: 'queued',
         start_time: null,
         end_time: null,
         duration: null,
         price: null,
         price_unit: 'USD',
         direction: 'outbound-api',
         answered_by: null,
         api_version: '2010-04-01',
         annotation: null,
         forwarded_from: null,
         group_sid: null,
         caller_name: null,
         uri: '/2010-04-01/Accounts/XXX/Calls/YYY.json',
         subresource_uris:
         { notifications: '/2010-04-01/Accounts/XXX/Calls/YYY/Notifications.json',
         recordings: '/2010-04-01/Accounts/XXX/Calls/YYY/Recordings.json' },
         dateCreated: null,
         dateUpdated: null,
         parentCallSid: null,
         accountSid: 'XXX',
         toFormatted: '(415) 234-1234',
         fromFormatted: '(415) 234-1234',
         phoneNumberSid: 'ZZZ',
         startTime: null,
         endTime: null,
         priceUnit: 'USD',
         answeredBy: null,
         apiVersion: '2010-04-01',
         forwardedFrom: null,
         groupSid: null,
         callerName: null,
         subresourceUris:
         { notifications: '/2010-04-01/Accounts/XXX/Calls/YYY/Notifications.json',
         recordings: '/2010-04-01/Accounts/XXX/Calls/YYY/Recordings.json' }
         }*/
        return {
          'sid': callSid,
          'account_sid': config.twilio.accountSid,
          'accountSid': config.twilioAccountSid,
          'to': to,
          'from': from,
          'call_sid': callSid,
          'callSid': callSid
        }
      })
  })

  after(nock.cleanAll)

  it('initiates a call', () => {
    return Call.make(chance.sentence())
  })
})
