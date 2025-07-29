'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblDaftarUlangSchema extends Schema {
  up () {
    this.create('tbl_daftar_ulangs', (table) => {
      table.increments()
      table
          .integer('register_id')
          .unsigned()
          .references('id')
          .inTable('tbl_register_ppdbs')
          .onDelete('CASCADE')
      table.string('code_registrasi_ulang').nullable()
      table
          .integer('register_by')
          .unsigned()
          .references('id')
          .inTable('tbl_users')
          .onDelete('CASCADE')
      table.string('biaya_pendaftaran').default('0')
      table.string('bukti_pembayaran')
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_daftar_ulangs')
  }
}

module.exports = TblDaftarUlangSchema
