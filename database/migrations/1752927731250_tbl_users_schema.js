'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblUsersSchema extends Schema {
  up () {
    this.table('tbl_users', (table) => {
      table.string('type_users',50).notNullable()
      table.date('tanggal_masuk').nullable()
      table.string('foto_profile').nullable()
    })
  }

  down () {
    this.table('tbl_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblUsersSchema
