import diehard from 'diehard'
import Promise from 'bluebird'
import expressInitializer from './initializations/express'

Promise
  .try(expressInitializer.initialize)
  .then(() => diehard.listen({timeout: 5000}))
