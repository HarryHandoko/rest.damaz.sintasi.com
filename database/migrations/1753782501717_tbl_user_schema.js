'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblUserSchema extends Schema {
  up () {
    this.table('tbl_users', (table) => {
      table.string('otp').nullable();
    })
  }

  down () {
    this.table('tbl_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblUserSchema
