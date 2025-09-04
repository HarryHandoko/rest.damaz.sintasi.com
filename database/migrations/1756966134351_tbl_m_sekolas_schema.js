'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblMSekolasSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.boolean('is_sdit').defaultTo(false)
      table.integer('biaya_admin_sdit').defaultTo(0)
      table.integer('biaya_pendaftaran_sdit').defaultTo(0)
    })
  }

  down () {
    this.table('tbl_m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblMSekolasSchema
