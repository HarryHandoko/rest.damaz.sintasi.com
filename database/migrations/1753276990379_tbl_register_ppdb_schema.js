'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table
          .integer('siswa_id')
          .unsigned()
          .references('id')
          .inTable('tbl_register_ppdb_siswas')
          .onDelete('CASCADE')
          .after('sekolah_id')
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSchema
