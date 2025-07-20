'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblArtikelSchema extends Schema {
  up () {
    this.create('tbl_artikel', (table) => {
      table.increments()
      table.string('title', 255).notNullable()
      table.longText('content').notNullable()
      table.enum('status', ['draft', 'scheduled', 'published']).defaultTo('draft')
      table.timestamp('scheduled_at').nullable()
      table.timestamp('published_at').nullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('tbl_users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('tbl_artikel')
  }
}

module.exports = TblArtikelSchema
