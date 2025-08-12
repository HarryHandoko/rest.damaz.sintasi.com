'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MPengurusYayasansSchema extends Schema {
  up () {
    this.table('m_pengurus_yayasans', (table) => {
     table.string('tipe').nullable();
    })
  }

  down () {
    this.table('m_pengurus_yayasans', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MPengurusYayasansSchema
