'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblSekolahGradesSchema extends Schema {
  up () {
    this.table('tbl_sekolah_grades', (table) => {
      table.integer('sort').default(0)
    })
  }

  down () {
    this.table('tbl_sekolah_grades', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblSekolahGradesSchema
