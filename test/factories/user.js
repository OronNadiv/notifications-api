import Bookshelf from '../../src/db/bookshelf'

const Model = Bookshelf.Model.extend({
  tableName: 'public.users'
})

module.exports = factory => {
  factory.define('user', Model, {
    name: factory.chance.word(),
    is_active: factory.chance.bool(),
    token_expires_in_minutes: factory.chance.integer({min: 1, max: 9999})
  })
}
