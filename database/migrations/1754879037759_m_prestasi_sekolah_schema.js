'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MPrestasiSekolahSchema extends Schema {
  up () {
    this.create('m_prestasi_sekolahs', (table) => {
     table.increments()
      table.string('image');
      table.string('prestasi');
      table.string('deskripsi');
      table.string('is_active').default('1')
      table.timestamps()
    })
  }

  down () {
    this.drop('m_prestasi_sekolahs')
  }
}

module.exports = MPrestasiSekolahSchema
