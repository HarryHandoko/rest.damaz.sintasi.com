'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('nem').default('0')
      table.string('file_raport').nullable()
      table.string('file_kartu_keluarga').nullable()
      table.string('file_akte_lahir').nullable()
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSchema
