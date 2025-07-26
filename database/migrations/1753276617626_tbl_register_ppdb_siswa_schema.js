'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswaSchema extends Schema {
  up () {
    this.create('tbl_register_ppdb_siswas', (table) => {
      table.increments()
      table.string('nama_depan').nullable()
      table.string('nama_belakang').nullable()
      table.date('tgl_lahir').nullable()
      table.string('tempat_lahir').nullable()
      table.string('jenis_kelamin').nullable()
      table.string('kebutuhan_spesial').default(0)
      table.string('bahasa_sehari_hari')
      table
          .integer('registed_by')
          .unsigned()
          .references('id')
          .inTable('tbl_users')
          .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdb_siswas')
  }
}

module.exports = TblRegisterPpdbSiswaSchema
