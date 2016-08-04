import '../../config'

import Bookshelf from '../bookshelf'

export default Bookshelf.Model.extend({
  tableName: 'public.groups',
  hasTimestamps: true,

  initialize () {
    this.on('saving', () => {
      throw new Error('Groups table cannot be modified.')
    })
    this.on('destroying', () => {
      throw new Error('Groups table cannot be modified.')
    })
  }
})
