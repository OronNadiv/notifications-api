const verbose = require('debug')('ha:routes:emails:verbose')
const info = require('debug')('ha:routes:emails:info')
const warn = require('debug')('ha:routes:emails:warn')

import {Router} from 'express'
import _str from 'underscore.string'
import config from '../config'
import Group from '../db/models/group'
import Mailgun from 'mailgun-js'
import postgresArray from 'postgres-array'
import Promise from 'bluebird'

const mailgun = Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain})
const router = new Router()

router.post('/emails', (req, res, next) => {
  if (!config.isAlertActive.email()) {
    warn('Not sending email')
    return res.sendStatus(204)
  }
  Promise
    .resolve(Group.forge().query(qb => {
      qb.where('id', '=', req.client.group_id)
    }).fetch())
    .then(group => {
      const emails = postgresArray.parse(group.get('emails'))
      verbose('emails:', emails)

      const data = {
        from: config.mailgun.sender,
        to: _str.join(',', emails),
        subject: req.body.subject,
        text: req.body.text
      }

      verbose('Sending email. Data:', data)
      return mailgun.messages().send(data)
        .then(resp => {
          verbose('mailgun response:', resp)
          info(
            'Mail sent successfully.',
            'Subject:',
            req.body.subject,
            'Text:',
            req.body.text
          )
          res.sendStatus(204)
        })
    })
    .catch(next)
})

export default router
