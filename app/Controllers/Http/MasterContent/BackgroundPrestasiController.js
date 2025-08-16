'use strict'

const BackgroundPrestasi = use('App/Models/MasterContent/BackgroundPrestasi')
const Env = use('Env') // for Adonis 4.x
const Sekolah = use('App/Models/MasterData/Sekolah')

class BackgroundPrestasiController {
  async index ({ request, response }) {
    const { sekolah_id } = request.all()
    const baseUrl = Env.get('APP_URL') // pastikan APP_URL ada

    const data = await BackgroundPrestasi.query()
      .whereRaw('MD5(sekolah_id) = ?',sekolah_id)
      .fetch()

    const result = data.toJSON().map(item => {
      return {
        ...item,
        image_prestasi_sekolah: item.image_prestasi_sekolah
          ? `${baseUrl}/uploads/background-prestasi/${item.image_prestasi_sekolah}`
          : null,
        image_prestasi_siswa: item.image_prestasi_siswa
          ? `${baseUrl}/uploads/background-prestasi/${item.image_prestasi_siswa}`
          : null,
        image_prestasi_guru: item.image_prestasi_guru
          ? `${baseUrl}/uploads/background-prestasi/${item.image_prestasi_guru}`
          : null,
        image_prestasi_kepala_sekolah: item.image_prestasi_kepala_sekolah
          ? `${baseUrl}/uploads/background-prestasi/${item.image_prestasi_kepala_sekolah}`
          : null,
      }
    })

    return response.status(200).json({
      data: result,
      message: 'Data Background Prestasi retrieved successfully'
    })
  }


  async store ({ request, response }) {
    try {
      const data = request.only(['sekolah_id'])
      const sekolahID = await Sekolah.query().whereRaw('MD5(id) = ?',request.input('sekolah_id')).first();
      const sekolah_id = sekolahID ? sekolahID.id : null;
      // cari record berdasarkan sekolah_id
      let backgroundPrestasi = await BackgroundPrestasi.query()
        .where('sekolah_id',sekolah_id)
        .first()

      // helper untuk upload file
      async function handleUpload(fieldName, saveKey) {
        const file = request.file(fieldName, { size: '5mb' })
        if (file) {
          const fileName = `${new Date().getTime()}-${fieldName}.${file.extname}`
          await file.move('public/uploads/background-prestasi', {
            name: fileName,
            overwrite: true,
          })
          data[saveKey] = fileName
        }
      }

      // proses upload masing-masing foto
      await handleUpload('image_prestasi_sekolah', 'image_prestasi_sekolah')
      await handleUpload('image_prestasi_siswa', 'image_prestasi_siswa')
      await handleUpload('image_prestasi_guru', 'image_prestasi_guru')
      await handleUpload('image_prestasi_kepala_sekolah', 'image_prestasi_kepala_sekolah')


      data.sekolah_id = sekolahID.id;

      if (backgroundPrestasi != null) {
        // update kalau sudah ada
        backgroundPrestasi.merge(data)
        await backgroundPrestasi.save()
      } else {
        // buat baru kalau belum ada
        backgroundPrestasi = await BackgroundPrestasi.create(data)
      }

      return response.status(201).json(backgroundPrestasi)
    } catch (error) {
      return response.status(500).json({ error: 'Failed to save Background Prestasi' })
    }

  }
}

module.exports = BackgroundPrestasiController
