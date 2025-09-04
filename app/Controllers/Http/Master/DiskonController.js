'use strict'

const Diskon = use("App/Models/Master/Diskon")

class DiskonController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')

    const dataQuery = Diskon.query()

    if (search) {
      dataQuery.where('diskon', 'like', `%${search}%`)
    }

    const data = await dataQuery.paginate(page, perPage)

    return response.json(data)
  }

  async store({ request, response }) {
    try {
      const data = request.only(['diskon']);

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
      const data = request.only(['diskon'])

      const diskon = await Diskon.find(id)

      if (!diskon) {
        return response.status(404).json({
          message: 'Diskon tidak ditemukan'
        })
      }

      diskon.diskon = data.diskon
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
