'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblTestimoniSchema extends Schema {
  up () {
    this.create('tbl_testimonis', (table) => {
      table.increments()
      table.string('nama')
      table.string('jabatan')
      table.text('testimoni')
      table.string('is_delete').default('0')
      table.string('deleted_by').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_testimonis')
  }
}

module.exports = TblTestimoniSchema
