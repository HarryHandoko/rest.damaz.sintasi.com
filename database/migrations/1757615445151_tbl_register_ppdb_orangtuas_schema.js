'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbOrangtuasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      table.string('penanggung_jawab').default('Orang Tua');
    })
  }

  down () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbOrangtuasSchema
