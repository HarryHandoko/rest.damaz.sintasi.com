'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblPrestasiUnitSchema extends Schema {
  up () {
    this.table('tbl_prestasi_units', (table) => {
      table.string('is_active').default('1')
    })
  }

  down () {
    this.table('tbl_prestasi_units', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblPrestasiUnitSchema
