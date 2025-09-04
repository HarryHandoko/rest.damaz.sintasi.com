'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.boolean('is_alumni').defaultTo(false)
    })
  }

  down () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.dropColumn('is_alumni')
    })
  }
}

module.exports = TblRegisterPpdbSiswasSchema
