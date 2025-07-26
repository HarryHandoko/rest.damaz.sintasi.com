'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblRegisterPpdbAddressSchema extends Schema {
  up () {
    this.create('tbl_register_ppdb_addresses', (table) => {
      table.increments()
      table.text('alamat').nullable()
      table.string('rt').nullable()
      table.string('rw').nullable()
      table.string('zip_code').nullable()
      table.string('provinsi_id').nullable()
      table.string('city_id').nullable()
      table.string('district_id').nullable()
      table.string('subdistrict_id').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_register_ppdb_addresses')
  }
}

module.exports = TblRegisterPpdbAddressSchema
