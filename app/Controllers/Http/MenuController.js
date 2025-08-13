'use strict'
const Menu = use('App/Models/Menu')
const Database = use('Database') // (Adonis 4.x)

class MenuController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    // 1. Paginate parent menu (parent_id = 0)
    const parentMenus = await Menu.query()
      .where('parent_id', 0)
      .orderBy('sort', 'asc')
      .paginate(page, 9999)

    // 2. Convert to JSON
    const parentMenusJSON = parentMenus.toJSON()

    // 3. For each parent, get submenu
    await Promise.all(
      parentMenusJSON.data.map(async (menu) => {
        const submenu = await Menu.query()
          .where('parent_id', menu.id)
          .orderBy('sort', 'asc')
          .fetch()
        menu.children = submenu.toJSON()  // pakai 'children', bukan 'submenu' supaya konsisten dengan front-end
      })
    )

    // 4. Return with meta pagination info
    return response.json({
      data: parentMenusJSON.data,
      total: parentMenusJSON.total,
      perPage: parentMenusJSON.perPage,
      currentPage: parentMenusJSON.currentPage,
      lastPage: parentMenusJSON.lastPage,
    })
  }


  async store({ request, response }) {
    try {
      const data = request.only(['name', 'path', 'icon', 'parent_id'])
      const lastMenu = await Menu.query()
          .where('parent_id', data.parent_id || 0)
          .orderBy('sort', 'desc')
          .first()

        const newSort = lastMenu ? lastMenu.sort + 1 : 1

        const menu = await Menu.create({
          name: data.name,
          path: data.path,
          icon: data.icon,
          parent_id: data.parent_id,
          sort: newSort
        })

        await Database
          .table('roles_permissions_menus')
          .insert({
            role_id: 2,
            menu_id: menu.id,
          })
      return response.status(201).json({
        message: 'Menu created successfully',
        data: menu
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error creating menu',
        error: error.message
      })
    }
  }

  async delete({ request, response }) {
    try {
      const { id } = request.only(['id'])
      const menu = await Menu.findOrFail(id)
      await menu.delete()
      return response.status(200).json({
        message: 'Menu deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting menu',
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    try {
      const { id, name, path, icon } = request.only(['id', 'name', 'path', 'icon'])
      const menu = await Menu.findOrFail(id)
      menu.name = name
      menu.path = path
      menu.icon = icon

      await menu.save()
      return response.status(200).json({
        message: 'Menu updated successfully',
        data: menu
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating menu',
        error: error.message
      })
    }
  }

  async updateSort({ request, response }) {
    try {
      const { id, type } = request.only(['id', 'type'])
      const menu = await Menu.findOrFail(id)

      // Cari menu "target" yang ingin ditukar sort-nya
      let targetMenu
      if (type === 'up') {
        // Menu dengan sort lebih kecil (di atas)
        targetMenu = await Menu.query()
          .where('parent_id', menu.parent_id)
          .where('sort', '<', menu.sort)
          .orderBy('sort', 'desc') // Ambil yang paling dekat ke atas
          .first()
      } else if (type === 'down') {
        // Menu dengan sort lebih besar (di bawah)
        targetMenu = await Menu.query()
          .where('parent_id', menu.parent_id)
          .where('sort', '>', menu.sort)
          .orderBy('sort', 'asc') // Ambil yang paling dekat ke bawah
          .first()
      }

      if (!targetMenu) {
        return response.status(400).json({
          message: 'Tidak bisa dipindahkan',
        })
      }

      // Tukar nilai sort
      const tempSort = menu.sort
      menu.sort = targetMenu.sort
      targetMenu.sort = tempSort

      await menu.save()
      await targetMenu.save()

      return response.status(200).json({
        message: 'Menu updated successfully',
        data: menu
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating menu',
        error: error.message
      })
    }
  }

}

module.exports = MenuController
