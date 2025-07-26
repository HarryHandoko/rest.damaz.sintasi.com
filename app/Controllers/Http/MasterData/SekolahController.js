'use strict'
const Sekolah = use('App/Models/MasterData/Sekolah')
const SekolahGrade = use('App/Models/MasterData/SekolahGrade')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class SekolahController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const baseUrl = Env.get('BASE_URL')

    // Paginate sekolah
    const data = await Sekolah.query()
      .where('is_delete', '0')
      .paginate(page, perPage)

    // Convert to plain JSON
    const dataJSON = data.toJSON()

    // Loop & inject grade and logo url
    await Promise.all(
      dataJSON.data.map(async (dataSekolah) => {
        // Ambil grades
        const grades = await SekolahGrade.query()
          .select('tbl_sekolah_grades.*','m_sekolas.name as nama_sekolah')
          .join('m_sekolas','m_sekolas.id','tbl_sekolah_grades.sekolah_id')
          .where('tbl_sekolah_grades.sekolah_id', dataSekolah.id)
          .fetch()

        // Tambahkan ke objek utama
        dataSekolah.grade = grades.toJSON()
        dataSekolah.logo = dataSekolah.logo
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.logo}`
          : null
      })
    )

    return response.json({
      data: dataJSON.data,
      total: dataJSON.total,
      perPage: dataJSON.perPage,
      currentPage: dataJSON.currentPage,
      lastPage: dataJSON.lastPage,
    })
  }


  async store({ request, response }) {
    try {
      // Ambil data dari body request

      const data = request.only(['name','biaya_admin','biaya_pendaftaran']);

      const logo = request.file('logo', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });

      if (logo) {
        const fileName = `${Date.now()}.${logo.extname}`;
        await logo.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.logo = fileName;
      } else {
        await trx.rollback();
        return response.status(400).json({ message: 'logo is required' });
      }

      // Simpan ke database
      const sekolah = await Sekolah.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'sekolah created successfully',
        data: sekolah,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await Sekolah.findOrFail(id)

      data.is_active = 0
      data.is_delete = 1
      data.deleted_by = auth.user.id

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



  async deleteGrade({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await SekolahGrade.findOrFail(id)

      data.destroy()

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



  async storeGrade({ request, response }) {
    try {
      const data = request.only(['name','sekolah_id']);
      const grade = await SekolahGrade.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: grade,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async updateGrade({ request, response }) {
    try {
      const data = request.only(['name']);
      const grade = await SekolahGrade.findOrFail(request.input('id'))

      grade.name = request.input('name')
      grade.save()

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: grade,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }



  async update({ request, response }) {
    try {
      const data = request.only(['name','biaya_admin','biaya_pendaftaran']);
      const sekolah = await Sekolah.findOrFail(request.input('id'))

      sekolah.name = request.input('name')
      sekolah.biaya_admin = request.input('biaya_admin')
      sekolah.biaya_pendaftaran = request.input('biaya_pendaftaran')
      sekolah.save()

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: sekolah,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async indexSelect({ request, response }) {
    const data = await Sekolah.query()
      .where('is_delete', '0').fetch()
    return response.json({
      data: data,
    })
  }



  async indexSelectGrade({ request, response }) {
    const data = await SekolahGrade.query()
      .where('sekolah_id', request.input('sekolah_id')).fetch()
    return response.json({
      data: data,
    })
  }

}

module.exports = SekolahController
