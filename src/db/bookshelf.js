import diehard from 'diehard'
import knex from 'knex'
import bookshelf from 'bookshelf'
import knexConfiguration from './knex'

const verbose = require('debug')('ha:db:bookshelf:verbose')

const repository = bookshelf(knex(knexConfiguration))

repository.plugin('visibility')

diehard.register(done => {
  verbose('Shutting down postgres connection.')
  repository.knex.destroy(() => {
    verbose('Postgres connection shutdown successfully.')
    done()
  })
})

export default repository
