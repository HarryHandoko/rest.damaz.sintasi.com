'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MDiskonSchema extends Schema {
  up () {
    this.table('m_diskon', (table) => {
      table.string('diskon_uang_pangkal').default(0);
    })
  }

  down () {
    this.table('m_diskon', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MDiskonSchema
