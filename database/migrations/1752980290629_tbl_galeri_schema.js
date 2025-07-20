'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblGaleriSchema extends Schema {
  up () {
    this.create('tbl_galeris', (table) => {
      table.increments()
      table.string('title').nullable()
      table.string('image').nullable()
      table.string('is_active').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_galeris')
  }
}

module.exports = TblGaleriSchema
