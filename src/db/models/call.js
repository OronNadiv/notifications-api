import Bookshelf from '../bookshelf'

const call = Bookshelf.Model.extend({
  tableName: 'calls',
  hasTimestamps: true
})

export default call
