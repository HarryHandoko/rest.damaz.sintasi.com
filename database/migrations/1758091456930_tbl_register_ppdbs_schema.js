"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TblRegisterPpdbsSchema extends Schema {
  up() {
    this.table("tbl_register_ppdbs", (table) => {
      table.text("sumber_informasi").nullable();
    });
  }

  down() {
    this.table("tbl_register_ppdbs", (table) => {
      table.dropColumn("sumber_informasi");
    });
  }
}

module.exports = TblRegisterPpdbsSchema;
