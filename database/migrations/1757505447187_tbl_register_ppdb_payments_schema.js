'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbPaymentsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_payments', (table) => {
      table.string('invoice').after('register_id')
    })
  }

  down () {
    this.table('tbl_register_ppdb_payments', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbPaymentsSchema
