'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblPrestasiUnitSchema extends Schema {
  up () {
    this.create('tbl_prestasi_units', (table) => {
      table.increments()
      table
          .integer('sekolah_id')
          .unsigned()
          .references('id')
          .inTable('m_sekolas')
          .onDelete('CASCADE')
          .nullable()
      table.string('image');
      table.string('name');
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_prestasi_units')
  }
}

module.exports = TblPrestasiUnitSchema
