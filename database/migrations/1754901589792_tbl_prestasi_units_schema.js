'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblPrestasiUnitsSchema extends Schema {
  up () {
    this.table('tbl_prestasi_units', (table) => {
      table.string('tingkat').nullable();
      table.string('tahun').nullable();
    })
  }

  down () {
    this.table('tbl_prestasi_units', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblPrestasiUnitsSchema
