'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TblArtikelTagSchema extends Schema {
  up () {
    this.create('tbl_artikel_tags', (table) => {
      table.integer('article_id').unsigned().notNullable().references('id').inTable('tbl_artikel').onDelete('CASCADE')
      table.integer('tag_id').unsigned().notNullable().references('id').inTable('tbl_tag').onDelete('CASCADE')
      table.primary(['article_id', 'tag_id'])
    })
  }

  down () {
    this.drop('tbl_artikel_tags')
  }
}

module.exports = TblArtikelTagSchema
