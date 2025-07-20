'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Roles = use('App/Models/Role')

class UserSeeder {
  async run () {
    const Hash = use('Hash')
    const adminRole = await Roles.create({
      name: 'Admin',
      slug: 'admin'
    })
    await User.create({
      nama_depan: 'John',
      nama_belakang: 'Doe',
      nik: '123456789',
      no_kk: '987654321',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'Laki-laki',
      agama: 'Islam',
      alamat: 'Jl. Contoh No. 1',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: await Hash.make('password'),
      role_id: adminRole.id
    })
  }
}

module.exports = UserSeeder
