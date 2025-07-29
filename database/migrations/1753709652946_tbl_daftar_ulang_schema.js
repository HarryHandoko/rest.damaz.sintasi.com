'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblDaftarUlangSchema extends Schema {
  up () {
    this.table('tbl_daftar_ulangs', (table) => {
      table.string('status_pembayaran').default('00')
    })
  }

  down () {
    this.table('tbl_daftar_ulangs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblDaftarUlangSchema
