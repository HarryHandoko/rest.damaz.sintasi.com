'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbPaymentSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_payments', (table) => {
      table.string('status_payment').default('00').comment('00 = payment waiting approval, 01 = payment sukses, 02 = payment rejected')
    })
  }

  down () {
    this.table('tbl_register_ppdb_payments', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbPaymentSchema
