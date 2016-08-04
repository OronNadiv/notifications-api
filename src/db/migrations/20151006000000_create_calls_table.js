export const up = knex => {
  return knex.schema.createTable('calls', table => {
    table.increments('id').primary()
    table.string('from').notNullable()
    table.string('to').notNullable()
    table.string('sid').notNullable()
    table.string('text').notNullable()
    table.json('data').notNullable()
    table.timestamps()
  })
}

export const down = knex => {
  return knex.schema.dropTable('calls')
}
