'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.string('agama').nullable();
      table.string('nik').nullable();
      table.string('no_akte_kelahiran').nullable();
      table.string('anak_ke').default('1');
      table.string('hobby').nullable();
      table.string('cita_cita').nullable();
      table.string('jumlah_saudara').nullable();
      table.string('tinggi_badan').nullable();
      table.string('berat_badan').nullable();
      table.string('riwayat_kesehatan').nullable();
      table.string('no_handphone').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSiswasSchema
