'use strict'

const Diskon = use("App/Models/Master/Diskon")

class DiskonController {
  async index({ request, response }) {
    const search = request.input('search', '')

    console.log('Backend received - Search:', search)

    const dataQuery = Diskon.query()

    if (search) {
      dataQuery.where('nama', 'like', `%${search}%`)
    }

    try {
      // Get all data without pagination
      const data = await dataQuery.fetch()

      const result = {
        data: data.toJSON()
      }

      return response.json(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      return response.status(500).json({ message: 'Error fetching data', error: error.message })
    }
  }  async store({ request, response }) {
    try {
      const data = request.only(['nama', 'nominal','diskon_uang_pangkal', 'kode', 'kuota']);

      await Diskon.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'Diskon created successfully',
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error', data: error.message })
    }
  }

  async update({ request, response }) {
    try {
      const id = request.input('id')
      const data = request.only(['nama', 'nominal', 'diskon_uang_pangkal','kode', 'kuota'])

      const diskon = await Diskon.find(id)

      if (!diskon) {
        return response.status(404).json({
          message: 'Diskon tidak ditemukan'
        })
      }

      diskon.nominal = data.nominal
      diskon.diskon_uang_pangkal = data.diskon_uang_pangkal
      diskon.nama = data.nama
      diskon.kode = data.kode
      diskon.kuota = data.kuota
      await diskon.save()

      return response.json({
        message: 'Diskon berhasil diupdate',
        data: diskon
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Terjadi kesalahan saat update',
        error: error.message
      })
    }
  }

  async delete({ request, response }) {
    try {
      const { id } = request.only(['id'])

      const diskon = await Diskon.find(id)

      if (!diskon) {
        return response.status(404).json({
          message: 'Diskon tidak ditemukan'
        })
      }

      await diskon.delete()

      return response.json({
        message: 'Diskon berhasil dihapus'
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error', data: error.message })
    }
  }
}

module.exports = DiskonController
