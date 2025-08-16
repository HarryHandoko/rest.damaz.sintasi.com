'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MBackgroundPrestasiUnitSchema extends Schema {
  up () {
    this.table('m_background_prestasi_units', (table) => {

      table.dropColumn('image')
      table.dropColumn('type')
      table.string('image_prestasi_sekolah').nullable()
      table.string('image_prestasi_siswa').nullable()
      table.string('image_prestasi_guru').nullable()
      table.string('image_prestasi_kepala_sekolah').nullable()
    })
  }

  down () {
    this.table('m_background_prestasi_units', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MBackgroundPrestasiUnitSchema
