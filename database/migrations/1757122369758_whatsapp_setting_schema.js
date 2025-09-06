"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class WhatsappSettingSchema extends Schema {
  up() {
    this.create("whatsapp_settings", (table) => {
      table.increments();
      table.string("api_key");
      table.string("phone_number");
      table.timestamps();
    });
  }

  down() {
    this.drop("whatsapp_settings");
  }
}

module.exports = WhatsappSettingSchema;
