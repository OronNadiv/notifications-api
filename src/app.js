import domain from 'domain'
import diehard from 'diehard'
import Promise from 'bluebird'
import expressInitializer from './initializations/express'

const error = require('debug')('ha:app:error')

const d = domain.create()

d.on('error', error)

d.run(() => {
  Promise
    .try(expressInitializer.initialize)
    .then(() => diehard.listen({timeout: 5000}))
})
