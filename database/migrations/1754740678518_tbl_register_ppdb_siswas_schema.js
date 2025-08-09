'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswasSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.string('goldarah').nullable()
      table.string('kewarganegaraan').nullable()
    })
  }

  down () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSiswasSchema
