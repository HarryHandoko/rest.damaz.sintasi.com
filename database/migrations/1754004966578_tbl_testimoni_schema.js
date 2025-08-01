'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblTestimoniSchema extends Schema {
  up () {
    this.table('tbl_testimonis', (table) => {
      table.string('image')
    })
  }

  down () {
    this.table('tbl_testimonis', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblTestimoniSchema
