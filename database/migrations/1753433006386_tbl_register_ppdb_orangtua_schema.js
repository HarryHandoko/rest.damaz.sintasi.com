'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbOrangtuaSchema extends Schema {
  up () {
    this.create('tbl_register_ppdb_orangtuas', (table) => {
      table.increments()
      table.string('nama_ayah').nullable()
      table.string('pendidikan_terakhir_ayah').nullable()
      table.string('pekerjaan_ayah').nullable()
      table.string('penghasilan_ayah').nullable()
      table.string('nama_ibu').nullable()
      table.string('pendidikan_terakhir_ibu').nullable()
      table.string('pekerjaan_ibu').nullable()
      table.string('penghasilan_ibu').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdb_orangtuas')
  }
}

module.exports = TblRegisterPpdbOrangtuaSchema
