'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbAddressesSchema extends Schema {
  up () {
    this.table('tbl_register_ppdb_addresses', (table) => {
      table.string('jarak_rumah_sekolah').nullable();
    })
  }

  down () {
    this.table('tbl_register_ppdb_addresses', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblRegisterPpdbAddressesSchema
