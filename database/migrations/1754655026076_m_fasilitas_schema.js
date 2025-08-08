'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MFasilitasSchema extends Schema {
  up () {
    this.create('m_fasilitas', (table) => {
      table.increments()
      table.string('title').nullable()
      table.string('image').nullable()
      table.string('is_active').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('m_fasilitas')
  }
}

module.exports = MFasilitasSchema
