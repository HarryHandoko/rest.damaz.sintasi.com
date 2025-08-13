'use strict'

const ProgramUnggulan = use('App/Models/MasterContent/ProgramUnggulan')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class ProgramUnggulanController {
 async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const galeriQuery = ProgramUnggulan.query()

    if (search) {
      galeriQuery.where('name', 'like', `%${search}%`)
    }
    const data = await galeriQuery.paginate(page, 9999)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/program-unggulan/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async store({ request, response }) {
    try {
      // Get the title from the request
      const data = request.only(['name','deskripsi'])

      // Get the image file (required or optional, up to you)
      const image = request.file('image', {
        size: '5mb'
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/program-unggulan', {
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
      const dataProgram = await ProgramUnggulan.create(data)

      return response.status(201).json({
        message: 'Program Unggulan berhasil dibuat',
        data: dataProgram
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat Program Unggulan',
        error: error.message
      })
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await ProgramUnggulan.findOrFail(id)

      await data.delete()
      return response.status(200).json({
        message: 'Data deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting Program Unggulan',
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

      const dataProgram = await ProgramUnggulan.find(id)
      if (!dataProgram) {
        return response.status(404).json({ message: 'Program Unggulan tidak ditemukan' })
      }

      // Update name jika ada
      const name = request.input('name')
      if (name) {
        dataProgram.name = name
      }


      // Update deskripsi jika ada
      const deskripsi = request.input('deskripsi')
      if (deskripsi) {
        dataProgram.deskripsi = deskripsi
      }

      // Jika ada file image baru
      const image = request.file('image', {
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/program-unggulan', {
          name: fileName,
          overwrite: true
        })
        dataProgram.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        dataProgram.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await dataProgram.save()

      return response.status(200).json({
        message: 'Galeri berhasil diupdate',
        data: dataProgram
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update Program Unggulan',
        error: error.message
      })
    }
  }


}

module.exports = ProgramUnggulanController
