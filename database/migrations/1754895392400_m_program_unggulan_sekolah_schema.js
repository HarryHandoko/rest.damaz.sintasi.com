'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MProgramUnggulanSekolahSchema extends Schema {
  up () {
    this.create('m_program_unggulan_sekolahs', (table) => {
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
      table.string('deskripsi');
      table.string('is_active').default('1');
      table.timestamps()
    })
  }

  down () {
    this.drop('m_program_unggulan_sekolahs')
  }
}

module.exports = MProgramUnggulanSekolahSchema
