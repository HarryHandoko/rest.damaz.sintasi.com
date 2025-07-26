'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswaPrestasiSchema extends Schema {
  up () {
    this.create('tbl_register_ppdb_siswa_prestasis', (table) => {
      table.increments()
      table
          .integer('siswa_id')
          .unsigned()
          .references('id')
          .inTable('tbl_register_ppdb_siswas')
          .onDelete('CASCADE')
      table.string('award')
      table.text('image')
      table.date('tgl_didapat')
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdb_siswa_prestasis')
  }
}

module.exports = TblRegisterPpdbSiswaPrestasiSchema
