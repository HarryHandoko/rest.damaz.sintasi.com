'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolasSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.dropColumn('biaya_admin_sdit');
      table.dropColumn('biaya_pendaftaran_sdit');
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolasSchema
