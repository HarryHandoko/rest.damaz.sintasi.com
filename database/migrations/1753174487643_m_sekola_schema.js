'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolaSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.integer('is_delete').default(0)
      table.string('deleted_by').nullable()
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolaSchema
