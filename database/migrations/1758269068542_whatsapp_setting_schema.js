'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WhatsappSettingSchema extends Schema {
  up () {
    this.table('whatsapp_settings', (table) => {
      table.renameColumn('format_pesan_diterima','format_pesan_admisi_diterima')
      table.renameColumn('format_pesan_ditolak','format_pesan_admisi_ditolak')
      // table.renameColumn('format_pesan_admisi_diterima','format_pesan_diterima')
      // table.renameColumn('format_pesan_admisi_ditolak','format_pesan_ditolak')
      table.string('format_pesan_pra_test_diterima')
      table.string('format_pesan_pra_test_ditolak')
    })
  }

  down () {
    this.table('whatsapp_settings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = WhatsappSettingSchema
