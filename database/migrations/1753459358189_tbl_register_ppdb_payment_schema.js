'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbPaymentSchema extends Schema {
  up () {
    this.create('tbl_register_ppdb_payments', (table) => {
      table.increments()
      table.string('bukti_transfer')
      table.date('tanggal_transaksi')
      table.text('keterangan').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdb_payments')
  }
}

module.exports = TblRegisterPpdbPaymentSchema
