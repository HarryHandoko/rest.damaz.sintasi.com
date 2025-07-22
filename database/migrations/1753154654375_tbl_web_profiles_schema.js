'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblWebProfilesSchema extends Schema {
  up () {
    this.table('tbl_web_profiles', (table) => {
      table.text('banner_misi').nullable();
    })
  }

  down () {
    this.table('tbl_web_profiles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblWebProfilesSchema
