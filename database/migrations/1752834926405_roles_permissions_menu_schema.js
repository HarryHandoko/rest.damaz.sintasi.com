'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RolesPermissionsMenuSchema extends Schema {
  up () {
    this.create('roles_permissions_menus', (table) => {
      table.increments()
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.integer('menu_id').unsigned().references('id').inTable('tbl_menus').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('roles_permissions_menus')
  }
}

module.exports = RolesPermissionsMenuSchema
