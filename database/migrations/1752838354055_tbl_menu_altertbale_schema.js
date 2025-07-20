'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblMenuAltertbaleSchema extends Schema {
  up () {
    this.table('tbl_menus', (table) => {
      table.string('sort').nullable().after('name')
    })
  }

  down () {
    this.table('tbl_menus', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblMenuAltertbaleSchema
