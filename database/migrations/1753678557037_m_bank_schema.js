'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MBankSchema extends Schema {
  up () {
    this.table('m_banks', (table) => {
      table.string('nama_akun_bank').nullable();
    })
  }

  down () {
    this.table('m_banks', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MBankSchema
