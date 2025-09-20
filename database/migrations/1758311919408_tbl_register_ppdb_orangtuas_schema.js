'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbOrangtuasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      table.text('ktp_ayah').nullable();
      table.text('ktp_ibu').nullable();
      table.text('ktp_wali').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbOrangtuasSchema
