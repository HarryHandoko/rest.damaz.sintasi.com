'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class addBeasiswaIdToTblRegisterPpdbSiswas extends Schema {
  up() {
    this.alter('tbl_register_ppdb_siswas', (table) => {
      table
        .integer('beasiswa_id')
        .unsigned()
        .references('id')
        .inTable('m_beasiswa')
    })
  }

  down() {
    this.alter('tbl_register_ppdb_siswas', (table) => {
      table.dropForeign('beasiswa_id') // hapus foreign key
      table.dropColumn('beasiswa_id')  // hapus kolom
    })
  }
}

module.exports = addBeasiswaIdToTblRegisterPpdbSiswas
