'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('status_test').default('00').comment('00 = Menunggu Proses Test, 01 = Diterima, 02 = Ditolak');
      table.date('tgl_test').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbsSchema
