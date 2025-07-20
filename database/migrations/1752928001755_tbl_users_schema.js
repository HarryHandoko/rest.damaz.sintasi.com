'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblUsersSchema extends Schema {
  up () {
    this.table('tbl_users', (table) => {
      table.string('is_active').default(1)
      table.string('is_delete').default(0)
      table.string('deleted_by').nullable()
    })
  }

  down () {
    this.drop('tbl_users')
  }
}

module.exports = TblUsersSchema
