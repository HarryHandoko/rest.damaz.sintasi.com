'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MDiskonSchema extends Schema {
  up () {
    this.table('m_diskon', (table) => {
      table.string('nama').after('id')
      table.renameColumn('diskon','nominal')
      table.string('kode').after('nama')
      table.integer('kuota').after('kode')
    })
  }

  down () {
    this.table('m_diskons', (table) => {
      table.dropColumn('nama')
      table.renameColumn('nominal','diskon')
      table.dropColumn('kode')
      table.dropColumn('kuota')
    })
  }
}

module.exports = MDiskonSchema
