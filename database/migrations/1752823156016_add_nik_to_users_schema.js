'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddNikToUsersSchema extends Schema {
  up () {
    this.table('tbl_users', (table) => {
      table.integer('role_id').unsigned().nullable().references('id').inTable('roles').onDelete('SET NULL')
    })
  }

  down () {
    this.table('tbl_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddNikToUsersSchema
