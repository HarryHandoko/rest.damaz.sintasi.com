'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblEskulUnitSchema extends Schema {
  up () {
    this.table('tbl_eskul_units', (table) => {
      // table.string('is_active').default('1')
    })
  }

  down () {
    this.table('tbl_eskul_units', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblEskulUnitSchema
