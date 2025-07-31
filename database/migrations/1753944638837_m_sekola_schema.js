'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolaSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.longText('kontent_detail').nullable()
      table.string('foto_kontent').nullable()
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolaSchema
