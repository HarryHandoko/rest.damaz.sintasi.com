'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BeasiswaSchema extends Schema {
  up() {
    this.create('m_beasiswa', (table) => {
      table.increments()
      table.string('nama')
      table.timestamps()
    })
  }

  down() {
    this.drop('m_beasiswa')
  }
}

module.exports = BeasiswaSchema
