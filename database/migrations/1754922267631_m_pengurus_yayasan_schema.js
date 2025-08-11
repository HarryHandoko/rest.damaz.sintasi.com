'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MPengurusYayasanSchema extends Schema {
  up () {
    this.create('m_pengurus_yayasans', (table) => {
      table.increments()
      table.string('pengurus').nullable();
      table.string('jabatan').nullable();
      table.string('header').nullable();
      table.string('image').nullable();
      table.longtext('sambutan').nullable();
      table.string('is_active').default('1');
      table.timestamps()
    })
  }

  down () {
    this.drop('m_pengurus_yayasans')
  }
}

module.exports = MPengurusYayasanSchema
