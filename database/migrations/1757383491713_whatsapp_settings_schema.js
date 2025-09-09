"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class WhatsappSettingsSchema extends Schema {
  up() {
    this.table("whatsapp_settings", (table) => {
      table.renameColumn("phone_number", "no_handphone");
      table.string("no_handphone_keuangan");
      table.text("format_pesan_registrasi");
      table.text("format_pesan_diterima");
      table.text("format_pesan_ditolak");
      table.text("format_pesan_keuangan");
    });
  }

  down() {
    this.table("whatsapp_settings", (table) => {
      // reverse alternations
    });
  }
}

module.exports = WhatsappSettingsSchema;
