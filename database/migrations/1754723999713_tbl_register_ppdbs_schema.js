'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('asal_sekolah').nullable();
      table.string('jenjang_terakhir').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbsSchema
