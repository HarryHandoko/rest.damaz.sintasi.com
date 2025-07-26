'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblUsersSchema extends Schema {
  up () {
    this.table('tbl_users', (table) => {
      table.integer('is_active_email').default(0)
    })
  }

  down () {
    this.table('tbl_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblUsersSchema
