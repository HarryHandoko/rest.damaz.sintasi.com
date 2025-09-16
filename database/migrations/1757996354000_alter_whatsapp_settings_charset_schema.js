"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AlterWhatsappSettingsCharsetSchema extends Schema {
  up() {
    this.raw(`
      ALTER TABLE whatsapp_settings
      CONVERT TO CHARACTER SET utf8mb4
      COLLATE utf8mb4_general_ci
    `);

    this.raw(`
      ALTER TABLE whatsapp_settings
      MODIFY COLUMN format_pesan_registrasi TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
      MODIFY COLUMN format_pesan_diterima TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
      MODIFY COLUMN format_pesan_ditolak TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
      MODIFY COLUMN format_pesan_keuangan TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
    `);
  }

  down() {
    this.raw(`
      ALTER TABLE whatsapp_settings
      CONVERT TO CHARACTER SET latin1
      COLLATE latin1_swedish_ci
    `);

    // Revert text columns back to latin1
    this.raw(`
      ALTER TABLE whatsapp_settings
      MODIFY COLUMN format_pesan_registrasi TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci,
      MODIFY COLUMN format_pesan_diterima TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci,
      MODIFY COLUMN format_pesan_ditolak TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci,
      MODIFY COLUMN format_pesan_keuangan TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci
    `);
  }
}

module.exports = AlterWhatsappSettingsCharsetSchema;
