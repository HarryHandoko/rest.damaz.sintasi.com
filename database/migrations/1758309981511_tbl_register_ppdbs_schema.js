'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbsSchema extends Schema {
  up () {
    this.table('tbl_register_ppdbs', (table) => {
      table.string('is_done_submit').comment('Jika 1 Maka sudah selesai penginputan, jika 0 makan masih proses penginputan').default(0);
    })
  }

  down () {
    this.table('tbl_register_ppdbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbsSchema
