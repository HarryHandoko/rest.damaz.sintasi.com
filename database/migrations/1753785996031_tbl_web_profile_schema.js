'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblWebProfileSchema extends Schema {
  up () {
    this.table('tbl_web_profiles', (table) => {
      table.string('brosur').nullable();
    })
  }

  down () {
    this.table('tbl_web_profiles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TblWebProfileSchema
