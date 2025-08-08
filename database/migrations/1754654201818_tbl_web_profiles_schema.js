'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblWebProfilesSchema extends Schema {
  up () {
    this.table('tbl_web_profiles', (table) => {
      table.string('tiktok').nullable();
    })
  }

  down () {
    this.table('tbl_web_profiles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblWebProfilesSchema
