'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbOrangtuaSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      table
          .integer('register_id')
          .unsigned()
          .references('id')
          .inTable('tbl_register_ppdbs')
          .onDelete('CASCADE')
          .after('id')
    })
  }

  down () {
    this.table('tbl_register_ppdb_orangtuas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbOrangtuaSchema
