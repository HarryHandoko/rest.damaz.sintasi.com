'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblSekolahGradesSchema extends Schema {
  up () {
    this.table('tbl_sekolah_grades', (table) => {
      table.string('biaya_formulir').default(0);
      table.string('biaya_uang_pangkal').default(0);
    })
  }

  down () {
    this.table('tbl_sekolah_grades', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblSekolahGradesSchema
