'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblDaftarUlangSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('is_daftar_ulang').default('0')
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblDaftarUlangSchema
