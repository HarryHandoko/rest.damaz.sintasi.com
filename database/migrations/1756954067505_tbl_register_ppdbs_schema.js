'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table
        .integer('diskon_id')
        .after('biaya_pendaftaran')
        .unsigned()
        .references('id')
        .inTable('m_diskon')
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      table.dropForeign('diskon_id') // hapus foreign key
      table.dropColumn('diskon_id')  // hapus kolom
    })
  }
}

module.exports = TblRegisterPpdbsSchema
