'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolaSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.integer('biaya_admin').alter()
      table.integer('biaya_pendaftaran').alter()
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolaSchema
