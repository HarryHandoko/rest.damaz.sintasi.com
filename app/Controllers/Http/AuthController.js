const jwt = require('jsonwebtoken')
'use strict'
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Menu = use('App/Models/Menu')
const Hash = use('Hash')
const Env = use('Env')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client("459746861160-sufkjqinf1hqc0lqk31i27ndvqoabt93.apps.googleusercontent.com")
const { createCanvas } = require('canvas')

class AuthController {
  // get User model
  async index({ request,response , auth }) {
    const baseUrl = Env.get('BASE_URL') // contoh: http://localhost:3333

    const user = await User.query().select('tbl_users.*','roles.name as  role_name').join('roles','roles.id','tbl_users.role_id').where('tbl_users.id', auth.user.id).first()

    const menuCollection = await Menu.query()
      .select('tbl_menus.*')
      .join('roles_permissions_menus', 'roles_permissions_menus.menu_id', 'tbl_menus.id')
      .where('roles_permissions_menus.role_id', user.role_id)
      .where('tbl_menus.parent_id', 0)
      .orderBy('tbl_menus.sort', 'asc')
      .fetch()
    const menus = menuCollection.toJSON()

    await Promise.all(menus.map(async (menu) => {
      const submenuCollection = await Menu.query()
        .select('tbl_menus.*')
        .join('roles_permissions_menus', 'roles_permissions_menus.menu_id', 'tbl_menus.id')
        .where('roles_permissions_menus.role_id', user.role_id)
        .where('tbl_menus.parent_id', menu.id)
        .orderBy('tbl_menus.sort', 'asc')
        .fetch()
      menu.submenu = submenuCollection.toJSON()
    }))

    // Siapkan object user + menu + foto_profile
    const result = {
      ...user.toJSON(),
      menu: menus,
      foto_profile: user.foto_profile
        ? `${baseUrl}/uploads/foto/${user.foto_profile}`
        : `${baseUrl}/default/profile.png` // default image jika tidak ada foto
    }

    return response.json(result)
  }


  async login({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.query()
        .select('tbl_users.*', 'roles.name as role_name')
        .join('roles', 'roles.id', 'tbl_users.role_id')
        .where('tbl_users.email', email)
        .first()
      if (!user) {
        return response.status(401).json({ status: 'error', message: 'Invalid email or password' })
      }

      if (user.is_active == "0" || user.is_delete == "1") {
        return response.status(401).json({ status: 'error', message: 'Akun tidak aktif, silahkan hubungi admin' })
      }
      const passwordVerified = await Hash.verify(password, user.password)
      if (!passwordVerified) {
        return response.status(401).json({ status: 'error', message: 'Invalid email or password' })
      }
      // Generate JWT token for v4.x
      const token = await auth.authenticator('jwt').generate(user.toJSON())
      user.token = token.token
      // Return user data and token
      return response.json({ status: 'success', user })
    } catch (error) {
      return response.status(500).json({ status: error, message: 'Server error' })
    }
  }


  async daftar({ request, response }) {
    try {

      // Ambil token & jawaban user
      const userAnswer = request.input('captcha')
      const token = request.input('token')
      if (!token) {
        return response.status(400).json({ status: 'error', message: 'Captcha token wajib diisi.' })
      }

      // Decode token
      const secret = Env.get('CAPTCHA_SECRET', 'default-secret')
      let payload
      try {
        payload = jwt.decode(token, secret)
      } catch (e) {
        return response.status(400).json({ status: 'error', message: 'Token captcha tidak valid.' })
      }

      // Cek exp
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        return response.status(400).json({ status: 'error', message: 'Captcha sudah expired. Silakan refresh.' })
      }

      // Cek jawaban
      if (String(userAnswer) !== String(payload.answer)) {
        return response.status(400).json({ status: 'error', message: 'Jawaban captcha salah.' })
      }

      // Cek email sudah dipakai?
      const userByEmail = await User.query().where('email', request.input('email')).first();
      if (userByEmail) {
        return response.status(200).json({status_code : '400' ,status: 'error', message: 'Email sudah digunakan' });
      }

      // Cek no handphone sudah dipakai?
      const userByHp = await User.query().where('no_handphone', request.input('no_handphone')).first();
      if (userByHp) {
        return response.status(200).json({ status_code : '400' ,status: 'error', message: 'No Handphone sudah digunakan' });
      }

      // Validasi privacy policy
      if (!request.input('privacyPolicies')) {
        return response.status(200).json({ status_code : '400' ,status: 'error', message: 'Silahkan checklist syarat & ketentuan terlebih dahulu' });
      }

      // Cek/ambil role pendaftar
      let roleData = await Role.query().where('slug', 'pendaftar').first();
      if (!roleData) {
        roleData = await Role.create({
          name: 'Pendaftar',
          slug: 'pendaftar'
        });
      }
      const roleId = roleData.id;

      // Simpan user baru
      await User.create({
        nama_depan: request.input('nama_depan'),
        nama_belakang: request.input('nama_belakang'),
        no_handphone: request.input('no_handphone'),
        email: request.input('email'),
        username: request.input('email'),
        password: request.input('password'),
        type_users: 'pendaftar',
        role_id: roleId,
        is_active: 1,
        tempat_lahir : '',
        tanggal_lahir : '1999-01-01',
        jenis_kelamin : 'Laki-laki',
      });

      return response.json({ status_code : '200' ,status: 'success', message: 'Pendaftaran berhasil, silahkan login' });
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }


  async getChaptca({ session, response }) {
    // 1. Generate angka random
    const captcha = Math.floor(1000 + Math.random() * 9000).toString()

    // 2. Generate JWT token berisi answer + expired (misal 3 menit)
    const secret = Env.get('CAPTCHA_SECRET', 'default-secret')
    const payload = { answer: captcha }
    const token = jwt.sign(payload, secret, { expiresIn: '3m' }) // expires in 3 minutes

    // 3. Buat gambar captcha
    const width = 100, height = 40
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.font = 'bold 32px Arial'
    ctx.fillStyle = '#222'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(captcha, width / 2, height / 2)
    for (let i = 0; i < 2; i++) {
      ctx.strokeStyle = '#bbb'
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }
    const image = canvas.toDataURL()

    // 4. Kirim ke frontend
    return response.json({ image, token })
  }


  async updateData({ request, response , auth}) {
    try {
      const {
        id,
        nama_depan,
        nama_belakang,
        email,
        no_handphone,
      } = request.only([
        'nama_depan', 'nama_belakang', 'email','no_handphone'
      ])
      const data = await User.findOrFail(auth.user.id)
      const emailCount = await User.query()
        .where('email', email)
        .whereNot('id', auth.user.id)
        .count()

      if (Number(emailCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'Email sudah digunakan oleh akun lain',
        })
      }

      // Cek no_handphone unik (selain user ini)
      const phoneCount = await User.query()
        .where('no_handphone', no_handphone)
        .whereNot('id', auth.user.id)
        .count()

      if (Number(phoneCount[0]['count(*)']) > 0) {
        return response.status(400).json({
          message: 'No Handphone sudah digunakan oleh akun lain',
        })
      }

      // Handle upload foto_profile jika ada
      const foto = request.file('foto_profile', {
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
      data.email = email
      data.no_handphone = no_handphone

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

  async changePassword({ request, response, auth }) {
    try {
      const { old_password, new_password } = request.only(['old_password', 'new_password'])
      if (!old_password || !new_password) {
        return response.status(400).json({ message: 'Password lama dan baru wajib diisi' })
      }

      const user = await User.findOrFail(auth.user.id)
      const passwordVerified = await Hash.verify(old_password, user.password)
      if (!passwordVerified) {
        return response.status(400).json({ message: 'Password lama salah' })
      }

      user.password = new_password
      await user.save()

      return response.status(200).json({ message: 'Password berhasil diubah' })
    } catch (error) {
      return response.status(500).json({ message: 'Gagal mengubah password', error: error.message })
    }
  }



  async googleLogin({ request, auth, response }) {
    try {
      const { token } = request.only(['token'])

      // Verify token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "459746861160-sufkjqinf1hqc0lqk31i27ndvqoabt93.apps.googleusercontent.com"
      })

      const payload = ticket.getPayload()
      const email = payload.email
      const name = payload.name
      const picture = payload.picture

      // Find or create user
      let user = await User.findBy('email', email)
      if (!user) {

      let roleData = await Role.query().where('slug', 'pendaftar').first();
      if (!roleData) {
        roleData = await Role.create({
          name: 'Pendaftar',
          slug: 'pendaftar'
        });
      }
      const roleId = roleData.id;
        user = await User.create({
          email,
          username: email,
          nama_depan: name,
          nama_belakang: '',
          tempat_lahir : '-',
          tanggal_lahir : '1999-01-01',
          jenis_kelamin : 'Laki-laki',
          no_handphone: '',
          type_users: 'pendaftar',
          role_id: roleId,
          password: Math.random().toString(36).slice(-8), // random password
          is_active: 1,
          is_active_email: 1,
          google_id: payload.sub,
        })
      }

      // Generate JWT
      const apiToken = await auth.authenticator('jwt').generate(user.toJSON())
      user.token = apiToken.token

      return response.json({
        user,
        token: apiToken
      })
    } catch (error) {
      return response.status(401).json({ message: 'Invalid Google token' })
    }
  }


}

module.exports = AuthController
