'use strict'

const PengurusYayasan = use('App/Models/MasterContent/PengurusYayasan')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class PengurusYayasanController {
 async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const dataQuery = PengurusYayasan.query()

    if (search) {
      dataQuery.where('pengurus', 'like', `%${search}%`)
    }
    const data = await dataQuery.paginate(page, perPage)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/pengurus/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async store({ request, response }) {
    try {
      // Get the title from the request
      const data = request.only(['pengurus','jabatan','header','sambutan','tipe'])

      // Get the image file (required or optional, up to you)
      const image = request.file('image', {
        size: '5mb'
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/pengurus', {
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
      const pengurus = await PengurusYayasan.create(data)

      return response.status(201).json({
        message: 'Data berhasil dibuat',
        data: pengurus
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
      const data = await PengurusYayasan.findOrFail(id)

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

      const DataPengurus = await PengurusYayasan.find(id)
      if (!DataPengurus) {
        return response.status(404).json({ message: 'Data tidak ditemukan' })
      }

      // Update pengurus jika ada
      const pengurus = request.input('pengurus')
      if (pengurus) {
        DataPengurus.pengurus = pengurus
      }


      // Update jabatan jika ada
      const jabatan = request.input('jabatan')
      if (jabatan) {
        DataPengurus.jabatan = jabatan
      }
      // Update sambutan jika ada
      const sambutan = request.input('sambutan')
      if (sambutan) {
        DataPengurus.sambutan = sambutan
      }


      // Update tipe jika ada
      const tipe = request.input('tipe')
      if (tipe) {
        DataPengurus.tipe = tipe
      }

      // Jika ada file image baru
      const image = request.file('image', {
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/pengurus', {
          name: fileName,
          overwrite: true
        })
        DataPengurus.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        DataPengurus.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await DataPengurus.save()

      return response.status(200).json({
        message: 'Data berhasil diupdate',
        data: DataPengurus
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update Data',
        error: error.message
      })
    }
  }


}

module.exports = PengurusYayasanController
