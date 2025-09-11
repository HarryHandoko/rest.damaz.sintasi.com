'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolasSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.string('batas_usia_min').default(0);
      table.string('batas_usia_max').default(0);
      table.dropColumn('batas_usia');
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolasSchema
