'use strict'

const BankAccount = use('App/Models/Master/BankAccount')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class BankAccountController {
 async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const bankQuery = BankAccount.query()

    if (search) {
      bankQuery.where('name', 'like', `%${search}%`)
    }
    const data = await bankQuery.paginate(page, 9999)
    const result = data.toJSON()
    result.data = result.data.map(data => {
      return {
        ...data,
        is_active : data.is_active == '1' || data.is_active == 1 ? true : false,
        image: data.image
          ? `${baseUrl}/uploads/bank-account/${data.image}`
          : null
      }
    })
    return response.json(result)
  }


  async indexPayment({ request, response }) {
    try {
      const baseUrl = Env.get('BASE_URL')

      // Ambil data bank yang aktif
      const bankQuery = await BankAccount.query().where('is_active', '1').fetch()
      const banks = bankQuery.toJSON()

      // Mapping dan format data
      const formatted = banks.map((bank) => ({
        ...bank,
        is_active: bank.is_active == '1' || bank.is_active == 1,
        image: bank.image
          ? `${baseUrl}/uploads/bank-account/${bank.image}`
          : null,
      }))

      return response.json({
        success: true,
        data: formatted,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Gagal mengambil data bank account',
        error: error.message,
      })
    }
  }



  async store({ request, response }) {
    try {
      // Get the title from the request
      const data = request.only(['name','no_rek','nama_akun_bank'])

      // Get the image file (required or optional, up to you)
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/bank-account', {
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
      const dataBank = await BankAccount.create(data)

      return response.status(201).json({
        message: 'Data berhasil dibuat',
        data: dataBank
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat data',
        error: error.message
      })
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await BankAccount.findOrFail(id)

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

      const dataBank = await BankAccount.find(id)
      if (!dataBank) {
        return response.status(404).json({ message: 'Data tidak ditemukan' })
      }

      // Update title jika ada
      const name = request.input('name')
      if (name) {
        dataBank.name = name
      }

      const nama_akun_bank = request.input('nama_akun_bank')
      if (nama_akun_bank) {
        dataBank.nama_akun_bank = nama_akun_bank
      }

      const no_rek = request.input('no_rek')
      if (no_rek) {
        dataBank.no_rek = no_rek
      }

      // Jika ada file image baru
      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png'],
        size: '5mb'
      })
      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move('public/uploads/bank-account', {
          name: fileName,
          overwrite: true
        })
        dataBank.image = fileName
      }

      // Update is_active jika dikirim (opsional)
      if (request.input('is_active') !== undefined) {
        dataBank.is_active = request.input('is_active') == 'true' ||  request.input('is_active') == true ? '1' : '0'
      }

      await dataBank.save()

      return response.status(200).json({
        message: 'Data berhasil diupdate',
        data: dataBank
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal update Data',
        error: error.message
      })
    }
  }


}

module.exports = BankAccountController
