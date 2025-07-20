'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblArtikelSchema extends Schema {
  up () {
    this.table('tbl_artikel', (table) => {
      table.text('slug').unique()
    })
  }

  down () {
    this.table('tbl_artikels', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblArtikelSchema
