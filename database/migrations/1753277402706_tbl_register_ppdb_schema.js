'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
     table.string('code_pendaftaran').after('id')
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbSchema
