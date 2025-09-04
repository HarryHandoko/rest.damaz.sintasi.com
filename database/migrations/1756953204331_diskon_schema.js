'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DiskonSchema extends Schema {
  up () {
    this.create('m_diskon', (table) => {
      table.increments()
      table.integer('diskon')
      table.boolean('is_active').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('m_diskon')
  }
}

module.exports = DiskonSchema
