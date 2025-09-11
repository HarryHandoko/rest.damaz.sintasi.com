'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolasSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.dropColumn('is_sdit');
      table.string('is_multi_biaya').default(0);
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolasSchema
