'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('is_form_done').default(0);
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbsSchema
