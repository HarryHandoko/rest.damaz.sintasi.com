'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSiswaBerprestasiSchema extends Schema {
  up () {
    this.create('m_siswa_berprestasis', (table) => {
      table.increments()
      table.string('image');
      table.string('prestasi');
      table.string('deskripsi');
      table.timestamps()
    })
  }

  down () {
    this.drop('m_siswa_berprestasis')
  }
}

module.exports = MSiswaBerprestasiSchema
