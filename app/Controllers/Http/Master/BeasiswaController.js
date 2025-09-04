'use strict'

const Beasiswa = use("App/Models/Beasiswa")

class BeasiswaController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')

    const dataQuery = Beasiswa.query()

    if (search) {
      dataQuery.where('nama', 'like', `%${search}%`)
    }

    const data = await dataQuery.paginate(page, perPage)

    return response.json(data)
  }

  async indexSelect({ request, response }) {
    const data = await Beasiswa.query().fetch()
    return response.json({
      data: data,
    })
  }

  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')

    const dataQuery = Beasiswa.query()

    if (search) {
      dataQuery.where('nama', 'like', `%${search}%`)
    }

    const data = await dataQuery.paginate(page, perPage)

    return response.json(data)
  }

  async store({ request, response }) {
    try {
      const data = request.only(['nama']);

      await Beasiswa.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'Beasiswa created successfully',
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error', data: error.message })
    }
  }

  async update({ request, response }) {
    try {
      const id = request.input('id')
      const data = request.only(['nama'])

      const beasiswa = await Beasiswa.find(id)

      if (!beasiswa) {
        return response.status(404).json({
          message: 'Beasiswa tidak ditemukan'
        })
      }

      // merge data baru ke record lama
      beasiswa.merge(data)

      await beasiswa.save()

      return response.json({
        message: 'Beasiswa berhasil diupdate',
        data: beasiswa
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

      const beasiswa = await Beasiswa.find(id)

      if (!beasiswa) {
        return response.status(404).json({
          message: 'Beasiswa tidak ditemukan'
        })
      }

      await beasiswa.delete()

      return response.json({
        message: 'Beasiswa berhasil dihapus'
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error', data: error.message })
    }
  }
}

module.exports = BeasiswaController
