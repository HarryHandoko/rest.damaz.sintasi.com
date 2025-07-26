'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolaSchema extends Schema {
  up () {
    this.create('m_sekolas', (table) => {
      table.increments()
      table.string('name').nullable()
      table.string('logo').nullable()
      table.float('biaya_admin').default(0)
      table.float('biaya_pendaftaran').default(0)
      table.integer('is_active').default(1)
      table.longText('dekripsi').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('m_sekolas')
  }
}

module.exports = MSekolaSchema
