'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSiswaBerprestasiSchema extends Schema {
  up () {
    this.table('m_siswa_berprestasis', (table) => {
      table.string('is_active').default(1)
    })
  }

  down () {
    this.table('m_siswa_berprestasis', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSiswaBerprestasiSchema
