'use strict'

const Galeri = use('App/Models/MasterContent/Galeri')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class GaleriController {
 async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('APP_URL')

    const galeriQuery = Galeri.query()

    if (search) {
      galeriQuery.where('title', 'like', `%${search}%`)
    }
    const data = await galeriQuery.paginate(page, perPage)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/galeri/${data.image}`
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
        await image.move('public/uploads/galeri', {
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
      const galeri = await Galeri.create(data)

      return response.status(201).json({
        message: 'Galeri berhasil dibuat',
        data: galeri
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat galeri',
        error: error.message
      })
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await Galeri.findOrFail(id)

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

      const galeri = await Galeri.find(id)
      if (!galeri) {
        return response.status(404).json({ message: 'Galeri tidak ditemukan' })
      }

      // Update title jika ada
      const title = request.input('title')
      if (title) {
        galeri.title = title
      }

      // Jika ada file image baru
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/galeri', {
          name: fileName,
          overwrite: true
        })
        galeri.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        galeri.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await galeri.save()

      return response.status(200).json({
        message: 'Galeri berhasil diupdate',
        data: galeri
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update galeri',
        error: error.message
      })
    }
  }


}

module.exports = GaleriController
