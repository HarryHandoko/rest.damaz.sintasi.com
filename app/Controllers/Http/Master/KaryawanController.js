'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const Env = use('Env') // for Adonis 4.x
const formatDate = (date) => {
  if (!date) return null
  // Pastikan date bertipe Date, jika bukan, parse dulu
  const d = new Date(date)
  // Hasilnya string "YYYY-MM-DD"
  return d.toISOString().slice(0, 10)
}

class KaryawanController {

 async index({ request, response }) {
    const baseUrl = Env.get('BASE_URL') // contoh: http://localhost:3333

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const data = await User.query()
      .where({
        type_users: 'karyawan',
        is_delete: 0
      })
      .paginate(page, 9999)

    // data (paginator) = { data: [], meta: {} }
    const result = data.toJSON()
    result.data = result.data.map(user => {
      return {
        ...user,
        tanggal_masuk : formatDate(user.tanggal_masuk),
        tanggal_lahir : formatDate(user.tanggal_lahir),
        is_active : user.is_active == '1' || user.is_active == 1 ? true : false,
        foto_profile: user.foto_profile
          ? `${baseUrl}/uploads/foto/${user.foto_profile}`
          : null // Atau default image url
      }
    })

    return response.json(result)
  }


  async update({ request, response }) {
    try {
      const { id, nama_depan, nama_belakang, nik, email, alamat, no_handphone ,is_active} = request.only([
        'id', 'nama_depan', 'nama_belakang', 'nik', 'email', 'alamat', 'no_handphone','is_active'
      ]);

      const data = await User.findOrFail(id);

      // Validate email uniqueness (exclude current user)
      const emailCount = await User.query()
        .where('email', email)
        .whereNot('id', id)
        .count();

      if (Number(emailCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'Email Sudah diambil oleh akun lain',
        });
      }

      // Validate phone number uniqueness (exclude current user)
      const phoneCount = await User.query()
        .where('no_handphone', no_handphone)
        .whereNot('id', id)
        .count();

      if (Number(phoneCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'No Handphone Sudah diambil oleh akun lain',
        });
      }

      // Save data
      data.nama_depan = nama_depan;
      data.nama_belakang = nama_belakang;
      data.nik = nik;
      data.email = email;
      data.alamat = alamat;
      data.no_handphone = no_handphone;
      data.is_active = is_active;
      await data.save();

      return response.status(200).json({
        message: 'Data updated successfully',
        data: data
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // app/Controllers/Http/UserController.js

  async store ({ request, response }) {
    try {
      // Ambil data dari body
      const data = request.only([
        'nama_depan',
        'nama_belakang',
        'nik',
        'email',
        'no_handphone',
        'alamat',
        'role_id',
        'tanggal_masuk',
        'tempat_lahir',,
        'tanggal_lahir',,
        'username',
        'jenis_kelamin'
      ])


      // Cek email unik (selain user ini)
      const emailCount = await User.query()
        .where('email', data.email)
        .count()

      if (Number(emailCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'Email sudah digunakan oleh akun lain',
        })
      }

      // Cek username unik (selain user ini, dan jika diisi)
      if (data.username) {
        const usernameCount = await User.query()
          .where('username', data.username)
          .count()
        if (Number(usernameCount[0]['count(*)']) > 0) {
          return response.status(400).json({
            message: 'Username sudah digunakan oleh akun lain',
          })
        }
        data.username = username
      }

      // Ambil file foto (opsional)
      const foto = request.file('foto', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '2mb'
      })

      if (foto) {
        const fileName = `${new Date().getTime()}.${foto.extname}`
        await foto.move('public/uploads/foto', {
          name: fileName,
          overwrite: true
        })
        data.foto_profile = fileName // Simpan nama file di database
      }
      data.password = request.input('password')
      data.type_users = 'karyawan'

      // Buat user baru
      const user = await User.create(data)

      return response.status(201).json({
        message: 'Berhasil Membuat User',
        data: user
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal Membuat Data',
        error: error.message
      })
    }
  }


  async updateData({ request, response }) {
    try {
      // Ambil data dari body (tambahkan username & field lain sesuai kebutuhan)
      const {
        id,
        nama_depan,
        nama_belakang,
        nik,
        email,
        alamat,
        no_handphone,
        username,
        role_id,
      } = request.only([
        'id', 'nama_depan', 'nama_belakang', 'nik', 'email', 'alamat', 'no_handphone', 'username','role_id'
      ])

      // Cari user yang akan diupdate
      const data = await User.findOrFail(id)

      // Cek email unik (selain user ini)
      const emailCount = await User.query()
        .where('email', email)
        .whereNot('id', id)
        .count()

      if (Number(emailCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'Email sudah digunakan oleh akun lain',
        })
      }

      // Cek username unik (selain user ini, dan jika diisi)
      if (username) {
        const usernameCount = await User.query()
          .where('username', username)
          .whereNot('id', id)
          .count()
        if (Number(usernameCount[0]['count(*)']) > 0) {
          return response.status(400).json({
            message: 'Username sudah digunakan oleh akun lain',
          })
        }
        data.username = username
      }

      // Handle upload foto_profile jika ada
      const foto = request.file('foto', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '2mb'
      })

      if (foto) {
        // Optional: hapus foto lama dari folder jika perlu
        const fileName = `${Date.now()}.${foto.extname}`
        await foto.move('public/uploads/foto', {
          name: fileName,
          overwrite: true
        })
        data.foto_profile = fileName
      }

      // Update field lain
      data.nama_depan = nama_depan
      data.nama_belakang = nama_belakang
      data.nik = nik
      data.email = email
      data.alamat = alamat
      data.no_handphone = no_handphone
      data.role_id = role_id
      data.type_users = role_id != 6 ? 'karyawan' : 'pendaftar'

      await data.save()

      return response.status(200).json({
        message: 'Data updated successfully',
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating user',
        error: error.message
      })
    }
  }



  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await User.findOrFail(id)

      data.is_active = 0
      data.is_delete = 1
      data.deleted_by = auth.user.id

      await data.save()
      return response.status(200).json({
        message: 'Data deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting Data',
        error: error.message
      })
    }
  }


}

module.exports = KaryawanController
