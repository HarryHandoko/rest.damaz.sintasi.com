'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblEskulUnitSchema extends Schema {
  up () {
    this.create('tbl_eskul_units', (table) => {
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
      table.string('is_active').default('1');
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_eskul_units')
  }
}

module.exports = TblEskulUnitSchema
