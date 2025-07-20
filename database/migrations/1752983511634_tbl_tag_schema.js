'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblTagSchema extends Schema {
  up () {
    this.create('tbl_tag', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('slug', 100).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_tags')
  }
}

module.exports = TblTagSchema
