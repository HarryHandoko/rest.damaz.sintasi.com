'use strict'

const Testimoni = use('App/Models/Testimoni')
const User = use('App/Models/User')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class TestimoniController {
 async index({ request, response, auth }) {

    const dataUser = await User.query()
    .select('roles.name as role_name','tbl_users.*')
    .join('roles','roles.id','tbl_users.role_id')
    .where('tbl_users.id',auth.user.id).first();

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    let dataQuery = Testimoni.query()
        .where('is_delete','0');

    if(dataUser.role_name == 'Pendaftar'){
      dataQuery = Testimoni.query()
        .where('is_delete','0')
        .where('registed_by',auth.user.id)
    }
    if (search) {
      dataQuery
      .where('nama', 'like', `%${search}%`)
    }
    const data = await dataQuery.paginate(page, perPage)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        image: data.image
          ? `${baseUrl}/uploads/testimoni/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async store({ request, response, auth }) {
    try {
      // Get the title from the request
      const data = request.only(['nama','testimoni','jabatan'])
      const dataUser = await User.query()
      .select('roles.name as role_name','tbl_users.*')
      .join('roles','roles.id','tbl_users.role_id')
      .where('tbl_users.id',auth.user.id).first();

      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png','webp'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/testimoni', {
          name: fileName,
          overwrite: true
        })
        data.image = fileName
      }

      if(dataUser.role_name == 'Pendaftar'){
        data.registed_by = auth.user.id
      }

      const dataTesti = await Testimoni.create(data)

      return response.status(201).json({
        message: 'Data berhasil dibuat',
        data: dataTesti
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat Data',
        error: error.message
      })
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await Testimoni.findOrFail(id)

      data.deleted_by = auth.user.id
      data.is_delete = 1
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


  async update({ request, response }) {
    try {
      const dataUser = await User.query()
      .select('roles.name as role_name','tbl_users.*')
      .join('roles','roles.id','tbl_users.role_id')
      .where('tbl_users.id',auth.user.id).first();
      const id = request.input('id')
      if (!id) {
        return response.status(400).json({ message: 'ID tidak ditemukan' })
      }

      const data = await Testimoni.find(id)
      if (!data) {
        return response.status(404).json({ message: 'data tidak ditemukan' })
      }


      if(dataUser.role_name == 'Pendaftar'){
        data.registed_by = auth.user.id
      }

      // Update title jika ada
      const nama = request.input('nama')
      if (nama) {
        data.nama = nama
      }


      // Update title jika ada
      const testimoni = request.input('testimoni')
      if (testimoni) {
        data.testimoni = testimoni
      }


      // Update title jika ada
      const jabatan = request.input('jabatan')
      if (jabatan) {
        data.jabatan = jabatan
      }



      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png','webp'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/testimoni', {
          name: fileName,
          overwrite: true
        })
        data.image = fileName
      }

      await data.save()

      return response.status(200).json({
        message: 'Data berhasil diupdate',
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update data',
        error: error.message
      })
    }
  }


}

module.exports = TestimoniController
