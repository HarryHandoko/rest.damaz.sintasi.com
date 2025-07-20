'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblWebProfileSchema extends Schema {
  up () {
    this.create('tbl_web_profiles', (table) => {
      table.increments()
      table.string('title', 150).notNullable()
      table.string('banner', 255)    // nama file atau path banner
      table.string('logo', 255)      // nama file atau path logo
      table.string('address', 255)
      table.string('whatsapp', 30)
      table.string('email', 120)
      // kolom sosial media
      table.string('social_fb', 120)
      table.string('social_ig', 120)
      table.string('social_youtube', 120)
      table.string('social_wa', 30)
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_web_profiles')
  }
}

module.exports = TblWebProfileSchema
