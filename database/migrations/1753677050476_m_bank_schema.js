'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MBankSchema extends Schema {
  up () {
    this.create('m_banks', (table) => {
      table.increments()
      table.string('name')
      table.string('image')
      table.string('is_active').default('1')
      table.timestamps()
    })
  }

  down () {
    this.drop('m_banks')
  }
}

module.exports = MBankSchema
