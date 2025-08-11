'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MProgramUnggulanSchema extends Schema {
  up () {
    this.create('m_program_unggulans', (table) => {
      table.increments()
      table.string('image').nullable();
      table.string('name').nullable();
      table.text('deskripsi').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('m_program_unggulans')
  }
}

module.exports = MProgramUnggulanSchema
