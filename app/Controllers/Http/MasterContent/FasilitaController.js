'use strict'

const Fasilita = use('App/Models/MasterContent/Fasilita')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class FasilitaController {
 async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const fasilitaQuery = Fasilita.query()

    if (search) {
      fasilitaQuery.where('title', 'like', `%${search}%`)
    }
    const data = await fasilitaQuery.paginate(page, 9999)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/fasilita/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async store({ request, response }) {
    try {
      // Get the title from the request
      const data = request.only(['title'])

      // Get the image file (required or optional, up to you)
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/fasilita', {
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
      const fasilita = await Fasilita.create(data)

      return response.status(201).json({
        message: 'Fasilitas berhasil dibuat',
        data: fasilita
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat Fasilitas',
        error: error.message
      })
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await Fasilita.findOrFail(id)

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

      const fasilita = await Fasilita.find(id)
      if (!fasilita) {
        return response.status(404).json({ message: 'Fasilitas tidak ditemukan' })
      }

      // Update title jika ada
      const title = request.input('title')
      if (title) {
        fasilita.title = title
      }

      // Jika ada file image baru
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/fasilita', {
          name: fileName,
          overwrite: true
        })
        fasilita.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        fasilita.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await fasilita.save()

      return response.status(200).json({
        message: 'Fasilitas berhasil diupdate',
        data: fasilita
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update Fasilitas',
        error: error.message
      })
    }
  }


}

module.exports = FasilitaController
