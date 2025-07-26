'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblSekolahGradeSchema extends Schema {
  up () {
    this.create('tbl_sekolah_grades', (table) => {
       table.increments()
        table.string('name').nullable()
        table
          .integer('sekolah_id')
          .unsigned()
          .references('id')
          .inTable('m_sekolas')
          .onDelete('CASCADE')
          .nullable()
        table.integer('is_active').default(1)
        table.timestamps()
    })
  }

  down () {
    this.drop('tbl_sekolah_grades')
  }
}

module.exports = TblSekolahGradeSchema
