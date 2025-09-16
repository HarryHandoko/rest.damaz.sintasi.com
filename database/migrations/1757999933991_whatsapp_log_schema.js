"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class WhatsappLogSchema extends Schema {
  up() {
    this.create("whatsapp_logs", (table) => {
      table.increments();
      table.string("kode_pendaftaran").notNullable();
      table.string("method").notNullable();
      table.string("status").notNullable();
      table.integer("attempt").defaultTo(1);
      table.integer("max_retries").defaultTo(1);
      table.text("message").nullable();
      table.text("response_data").nullable();
      table.text("error_details").nullable();
      table.timestamp("started_at").nullable();
      table.timestamp("completed_at").nullable();
      table.integer("processing_time_ms").nullable();
      table.timestamps();

      table.index(["kode_pendaftaran"]);
      table.index(["method"]);
      table.index(["status"]);
      table.index(["created_at"]);
    });
  }

  down() {
    this.drop("whatsapp_logs");
  }
}

module.exports = WhatsappLogSchema;
