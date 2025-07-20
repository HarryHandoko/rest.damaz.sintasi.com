const jwt = require('jsonwebtoken')
'use strict'
const User = use('App/Models/User')
const Menu = use('App/Models/Menu')
const Hash = use('Hash')
const Env = use('Env') // for Adonis 4.x
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

}

module.exports = AuthController
