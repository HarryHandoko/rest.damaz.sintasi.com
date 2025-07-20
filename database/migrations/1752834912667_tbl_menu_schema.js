'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblMenuSchema extends Schema {
  up () {
    this.create('tbl_menus', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('path', 100).notNullable()
      table.string('icon', 100).notNullable()
      table.string('parent_id', 100).default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_menus')
  }
}

module.exports = TblMenuSchema
