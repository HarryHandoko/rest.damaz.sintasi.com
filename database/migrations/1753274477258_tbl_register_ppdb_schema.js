'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSchema extends Schema {
  up () {
    this.create('tbl_register_ppdbs', (table) => {
      table.increments()
      table
          .integer('sekolah_id')
          .unsigned()
          .references('id')
          .inTable('m_sekolas')
          .onDelete('CASCADE')
      // id_tbl_data_siswa
      table
          .integer('grade_id')
          .unsigned()
          .references('id')
          .inTable('tbl_sekolah_grades')
          .onDelete('CASCADE')
          .nullable()
      table.date('tanggal_pendaftaran')
      table.string('status_pendaftaran').comment('P00 = Menunggu Konfirmasi, P001 = Diterima, P002 = Ditolak')
      table
          .integer('registed_by')
          .unsigned()
          .references('id')
          .inTable('tbl_users')
          .onDelete('CASCADE')
      table.string('biaya_admin').default(0)
      table.string('biaya_pendaftaran').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdbs')
  }
}

module.exports = TblRegisterPpdbSchema
