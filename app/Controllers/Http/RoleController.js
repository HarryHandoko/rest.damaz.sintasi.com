'use strict'
const Role = use('App/Models/Role')
const Menu = use('App/Models/Menu')
const Database = use('Database') // (Adonis 4.x)
class RoleController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const roles = await Role.query().paginate(page, perPage)
    return response.json(roles)
  }


  async getSelect({ request, response }) {
    const roles = await Role.query().fetch();
    return response.json(roles)
  }


  async store({ request, response }) {
    try {
      const data = request.only(['name'])
      const role = await Role.create({
        name: data.name,
        slug: data.name.toLowerCase().replace(/ /g, '-')
      })
      return response.status(201).json({
        message: 'Role created successfully',
        data: role
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error creating role',
        error: error.message
      })
    }
  }

  async delete({ request, response }) {
    try {
      const { id } = request.only(['id'])
      const role = await Role.findOrFail(id)
      await role.delete()
      return response.status(200).json({
        message: 'Role deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting role',
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    try {
      const { id, name } = request.only(['id', 'name'])
      const role = await Role.findOrFail(id)
      role.name = name
      role.slug = name.toLowerCase().replace(/ /g, '-')
      await role.save()
      return response.status(200).json({
        message: 'Role updated successfully',
        data: role
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating role',
        error: error.message
      })
    }
  }

  async getRolePermission({ request, response }) {
    try {
      // 1. Get all parent menus
      const role_id = request.input('id')
      const allMenuCollection = await Menu.query()
        .where('parent_id', 0)
        .orderBy('sort', 'asc')
        .fetch()
      const allMenus = allMenuCollection.toJSON()

      // 2. Mark menu & submenu as checked
      await Promise.all(allMenus.map(async (menu) => {
        menu.checked = await Database
          .from('roles_permissions_menus')
          .where('role_id', role_id)
          .where('menu_id', menu.id)
          .first() ? true : false // more efficient than .count() > 0

        const submenusCollection = await Menu.query()
          .where('parent_id', menu.id)
          .orderBy('sort', 'asc')
          .fetch()
        const submenus = submenusCollection.toJSON()

        // Properly resolve submenu async checked property
        menu.submenu = await Promise.all(submenus.map(async (sub) => ({
          ...sub,
          checked: await Database
            .from('roles_permissions_menus')
            .where('role_id', role_id)
            .where('menu_id', sub.id)
            .first() ? true : false
        })))
      }))

      return response.json({ menu: allMenus })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal mengambil permission menu',
        error: error.message
      })
    }
  }

async setPermission({ request, response }) {
  try {
    const role_id = request.input('id')
    const menuArray = request.input('permission')

    // CEK DULU
    if (!menuArray || !Array.isArray(menuArray)) {
      return response.status(400).json({
        message: 'Data menu tidak ditemukan atau tidak valid',
      })
    }

    await Database.from('roles_permissions_menus')
      .where('role_id', role_id)
      .delete()

    const permissions = menuArray

    if (permissions.length > 0) {
      const records = permissions.map(menu_id => ({
        role_id,
        menu_id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      await Database.table('roles_permissions_menus').insert(records)
    }

    return response.json({ success: true, message: 'Berhasil update permission' })
  } catch (error) {
    return response.status(500).json({
      message: 'Gagal update permission',
      error: error.message
    })
  }
}




}

module.exports = RoleController
