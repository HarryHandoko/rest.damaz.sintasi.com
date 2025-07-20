'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('tbl_users', (table) => {
      table.increments()
      table.string('nama_depan', 100).notNullable()
      table.string('nama_belakang', 100).notNullable()
      table.string('nik', 100).nullable().unique()
      table.string('no_kk', 100).nullable().unique()
      table.string('tempat_lahir', 100).notNullable()
      table.date('tanggal_lahir').notNullable()
      table.string('jenis_kelamin', 10).notNullable()
      table.string('agama', 50).nullable()
      table.string('alamat', 255).nullable()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
