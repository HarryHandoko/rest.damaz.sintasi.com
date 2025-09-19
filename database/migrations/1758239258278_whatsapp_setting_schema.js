'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WhatsappSettingSchema extends Schema {
  up () {
    this.table('whatsapp_settings', (table) => {
      table.text('format_pesan_pendaftaran_formulir_diterima')
      table.text('format_pesan_pendaftaran_formulir_ditolak')
    })
  }

  down () {
    this.table('whatsapp_settings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = WhatsappSettingSchema
