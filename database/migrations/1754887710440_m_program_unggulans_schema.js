'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MProgramUnggulansSchema extends Schema {
  up () {
    this.table('m_program_unggulans', (table) => {
      table.string('is_active').default('1');
    })
  }

  down () {
    this.table('m_program_unggulans', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MProgramUnggulansSchema
