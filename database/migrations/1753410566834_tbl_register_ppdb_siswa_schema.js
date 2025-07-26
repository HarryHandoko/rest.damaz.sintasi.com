'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSiswaSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      table.string('nisn').nullable()
    })
  }

  down () {
    this.table('tbl_register_ppdb_siswas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSiswaSchema
