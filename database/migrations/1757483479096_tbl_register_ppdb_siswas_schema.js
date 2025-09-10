'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.string('jenis_beasiswa');
      table.string('jumlah_juz');
      table.string('nama_prestasi');
      table.string('foto_sertifikat');
    })
  }

  down () {
    this.table('tbl_register_ppdb_siswas', (table) => {
    })
  }
}

module.exports = TblRegisterPpdbSiswasSchema
