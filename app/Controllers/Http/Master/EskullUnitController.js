'use strict'

const EskullUnit = use('App/Models/Master/EskullUnit')
const Sekolah = use('App/Models/MasterData/Sekolah')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class EskullUnitController {
 async index({ request, response }) {
    const sekolah_id = request.input('sekolah_id');
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const dataQuery = EskullUnit.query().whereRaw('MD5(sekolah_id) = ?',sekolah_id)

    if (search) {
      dataQuery.where('name', 'like', `%${search}%`)
    }
    const data = await dataQuery.paginate(page, 9999)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/eskullunit/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async store({ request, response }) {
    try {
      // Get the title from the request
      const data = request.only(['name','sekolah_id'])

      const sekolahID = await Sekolah.query().whereRaw('MD5(id) = ?',request.input('sekolah_id')).first();
      // Get the image file (required or optional, up to you)
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/eskullunit', {
          name: fileName,
          overwrite: true
        })
        data.image = fileName
      } else {
        return response.status(400).json({
          message: 'Image is required'
        })
      }
      data.is_active = 1
      data.sekolah_id = sekolahID.id;
      const dataEskull = await EskullUnit.create(data)

      return response.status(201).json({
        message: 'Data berhasil dibuat',
        data: dataEskull
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
      const data = await EskullUnit.findOrFail(id)

      await data.delete()
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
      const id = request.input('id')
      if (!id) {
        return response.status(400).json({ message: 'ID tidak ditemukan' })
      }

      const data = await EskullUnit.find(id)
      if (!data) {
        return response.status(404).json({ message: 'Data tidak ditemukan' })
      }

      // Update name jika ada
      const name = request.input('name')
      if (name) {
        data.name = name
      }

      // Jika ada file image baru
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/eskullunit', {
          name: fileName,
          overwrite: true
        })
        data.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        data.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await data.save()

      return response.status(200).json({
        message: 'data berhasil diupdate',
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update galeri',
        error: error.message
      })
    }
  }


}

module.exports = EskullUnitController
