'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MSekolasSchema extends Schema {
  up () {
    this.table('m_sekolas', (table) => {
      table.string('banner_beranda').nullable();
      table.string('moto').nullable();
      table.longText('visi').nullable();
      table.longText('misi').nullable();
      table.longText('sambutan_kepala_unit').nullable();
      table.string('foto_kepala_unit').nullable();
      table.string('foto_guru_unit').nullable();
    })
  }

  down () {
    this.table('m_sekolas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MSekolasSchema
