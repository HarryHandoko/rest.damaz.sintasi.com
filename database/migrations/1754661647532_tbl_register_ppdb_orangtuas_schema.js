'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbOrangtuasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      table.string('nik_ayah').nullable();
      table.string('nik_ibu').nullable();
      table.string('no_telepon_ibu').nullable();
      table.string('no_telepon_ayah').nullable();
      table.string('no_hp_ayah').nullable();
      table.string('no_hp_ibu').nullable();
      table.text('alamat_ayah').nullable();
      table.text('alamat_ibu').nullable();

      table.string('nama_wali').nullable();
      table.string('nik_wali').nullable();
      table.string('pendidikan_terkahir_wali').nullable();
      table.string('pekerjaan_wali').nullable();
      table.string('penghasilan_wali').nullable();
      table.string('no_telepon_wali').nullable();
      table.string('no_hp_wali').nullable();
      table.text('alamat_wali').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbOrangtuasSchema
