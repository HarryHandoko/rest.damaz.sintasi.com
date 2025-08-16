'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MBackgroundPrestasiUnitSchema extends Schema {
  up () {
    this.create('m_background_prestasi_units', (table) => {
      table.increments()
      table
          .integer('sekolah_id')
          .unsigned()
          .references('id')
          .inTable('m_sekolas')
          .onDelete('CASCADE')
          .nullable()
      table.string('image', 255).nullable()
      table.string('type').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('m_background_prestasi_units')
  }
}

module.exports = MBackgroundPrestasiUnitSchema
