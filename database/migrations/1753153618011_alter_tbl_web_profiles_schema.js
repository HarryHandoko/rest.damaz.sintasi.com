'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterTblWebProfilesSchema extends Schema {
  up () {
    this.table('tbl_web_profiles', (table) => {
      table.longText('tentang_kami').nullable();
      table.longText('komitmen_kami').nullable();
      table.text('banner_visi').nullable();
      table.text('banner_about').nullable();
    })
  }

  down () {
    this.table('tbl_web_profiles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterTblWebProfilesSchema
