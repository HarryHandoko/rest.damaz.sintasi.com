'use strict'
const Excel = require('exceljs')
const Helpers = use('Helpers')


const SiswaPpdb = use('App/Models/PPDB/SiswaPpdb')
const SiswaAward = use('App/Models/PPDB/SiswaAward')
const RegAddress = use('App/Models/PPDB/RegAddress')
const RegParent = use('App/Models/PPDB/RegParent')
const Payment = use('App/Models/PPDB/Payment')
const DaftarUlang = use('App/Models/PPDB/DaftarUlang')
const moment = require('moment')

const Sekolah = use('App/Models/MasterData/Sekolah')
const User = use('App/Models/User')
const SekolahGrade = use('App/Models/MasterData/SekolahGrade')
const Env = use('Env') // for Adonis 4.x

const RegisterPPDB = use('App/Models/PPDB/RegisterPpdb')
const WebProfile = use('App/Models/MasterContent/WebProfile')


const puppeteer = require('puppeteer')
const QRCode = require('qrcode')
const View = use('View')
const fs = require('fs')
const uuid = require('uuid')
const archiver = require('archiver')


const formatDate = (date) => {
  if (!date) return null
  // Pastikan date bertipe Date, jika bukan, parse dulu
  const d = new Date(date)
  // Hasilnya string "YYYY-MM-DD"
  return d.toISOString().slice(0, 10)
}
const formatDateNormal = (date) => {
  if (!date) return null

  const d = new Date(date)

  // Ambil hari, bulan, tahun
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // bulan dimulai dari 0
  const year = d.getFullYear()

  return `${day}-${month}-${year}`
}

class GenerateReportDaftarController {
  async generateRegisterPPDB({ request,response }) {
    try {
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet('List Daftar Ulang')
      const baseUrl = Env.get('BASE_URL')
      const filter = request.input('filter', {})

      // Base query from DaftarUlang
      let data = DaftarUlang.query()
        .join('tbl_register_ppdbs', 'tbl_register_ppdbs.id', 'tbl_daftar_ulangs.register_id')
        .select('tbl_daftar_ulangs.*', 'tbl_register_ppdbs.*') // select all base columns

      // Apply filters
      if (filter.status) {
        if (filter.status === 'Diterima') {
          data.where('tbl_daftar_ulangs.status_pembayaran', '01')
        } else if (filter.status === 'Dalam Proses') {
          data.where('tbl_daftar_ulangs.status_pembayaran', '00')
        } else if (filter.status === 'Ditolak') {
          data.where('tbl_daftar_ulangs.status_pembayaran', '02')
        }
      }

      if (filter.tahun_periodik) {
        data.where('tbl_register_ppdbs.tahun_periodik', filter.tahun_periodik)
      }

      // Execute
      data = await data.fetch()
      const dataRegis = data.toJSON()

      await Promise.all(dataRegis.map(async (item, index) => {
        const dataSiswa = await SiswaPpdb.query()
          .where('id', item.siswa_id)
          .first()

        const dataSiswaAward = await SiswaAward.query()
          .where('siswa_id', item.siswa_id)
          .first()

        const dataSekolah = await Sekolah.query()
          .where('id', item.sekolah_id)
          .first()

        const dataSekolahGrade = await SekolahGrade.query()
          .where('id', item.grade_id)
          .first()

        const dataSiswaAddress = await RegAddress.query()
          .select(
            'tbl_register_ppdb_addresses.*',
            'indonesia_provinces.name as provinsi',
            'indonesia_cities.name as kota',
            'indonesia_districts.name as district',
            'indonesia_villages.name as desa'
          )
          .joinRaw(`JOIN indonesia_provinces ON CONVERT(indonesia_provinces.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.provinsi_id`)
          .joinRaw(`JOIN indonesia_cities ON CONVERT(indonesia_cities.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.city_id`)
          .joinRaw(`JOIN indonesia_districts ON CONVERT(indonesia_districts.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.district_id`)
          .joinRaw(`JOIN indonesia_villages ON CONVERT(indonesia_villages.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.subdistrict_id`)
          .where('tbl_register_ppdb_addresses.register_id', item.register_id)
          .first()

        const dataRegister = await User.query()
          .where('id', item.registed_by)
          .first()

        const dataSiswaOrtu = await RegParent.query()
          .where('register_id', item.register_id)
          .first()

        const dataPayment = await Payment.query()
          .where('register_id', item.register_id)
          .first()

        // siswa
        const siswa = dataSiswa?.toJSON() || null
        if (siswa) {
          const today = new Date()
          const birth = new Date(siswa.tgl_lahir)
          let usia = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            usia--
          }
          siswa.usia = usia
          siswa.tgl_lahir = formatDate(siswa.tgl_lahir)
          siswa.foto_siswa = siswa.foto_siswa
            ? `${baseUrl}/uploads/foto_siswa/${siswa.foto_siswa}`
            : null
        }

        // awards
        const siswaAwards = dataSiswaAward?.toJSON() || null
        if (siswaAwards) {
          siswaAwards.tgl_didapat = formatDate(siswaAwards.tgl_didapat)
          siswaAwards.image = siswaAwards.image
            ? `${baseUrl}/uploads/award_siswa/${siswaAwards.image}`
            : null
        }

        // payment
        const PaymentData = dataPayment?.toJSON() || null
        if (PaymentData) {
          PaymentData.tanggal_transaksi = formatDate(PaymentData.tanggal_transaksi)
          PaymentData.bukti_transfer = PaymentData.bukti_transfer
            ? `${baseUrl}/uploads/payment/${PaymentData.bukti_transfer}`
            : null
        }

        // attach enriched data
        dataRegis[index].siswa = siswa
        dataRegis[index].siswa_award = siswaAwards
        dataRegis[index].siswa_address = dataSiswaAddress?.toJSON() || null
        dataRegis[index].siswa_parent = dataSiswaOrtu?.toJSON() || null
        dataRegis[index].payment = PaymentData
        dataRegis[index].tgl_test = dataRegis[index].tgl_test
          ? formatDateNormal(dataRegis[index].tgl_test)
          : null
        dataRegis[index].register = dataRegister?.toJSON() || null
        dataRegis[index].sekolah = dataSekolah?.toJSON() || null
        dataRegis[index].sekolah_grade = dataSekolahGrade?.toJSON() || null
        dataRegis[index].file_raport = dataRegis[index].file_raport
          ? `${baseUrl}/uploads/ppdb/raport/${dataRegis[index].file_raport}`
          : null
        dataRegis[index].file_akte_lahir = dataRegis[index].file_akte_lahir
          ? `${baseUrl}/uploads/ppdb/akte_lahir/${dataRegis[index].file_akte_lahir}`
          : null

        dataRegis[index].bukti_pembayaran = dataRegis[index].bukti_pembayaran
          ? `${baseUrl}/uploads/ppdb/bukti_pembayaran_reg_ulang/${dataRegis[index].bukti_pembayaran}`
          : null
        dataRegis[index].file_kartu_keluarga = dataRegis[index].file_kartu_keluarga
          ? `${baseUrl}/uploads/ppdb/kartu_keluarga/${dataRegis[index].file_kartu_keluarga}`
          : null
      }))



      worksheet.columns = [
        { header: 'Kode Registrasi', key: 'code_pendaftaran', width: 30 },
        { header: 'Status', key: 'status_pendaftaran', width: 30 },
        { header: 'Tanggal Pendaftaran', key: 'tanggal_pendaftaran', width: 30 },
        { header: 'Nama Pendaftar', key: 'nama_pendaftar', width: 30 },
        { header: 'No Handphone', key: 'no_handphone', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Nama Siswa', key: 'nama_siswa', width: 30 },
        { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 30 },
        { header: 'Tempat Lahir', key: 'tempat_lahir', width: 30 },
        { header: 'Tanggal Lahir', key: 'tgl_lahir', width: 30 },
        { header: 'NIK', key: 'nik', width: 30 },
        { header: 'NIS', key: 'nis', width: 30 },
        { header: 'NISN', key: 'nisn', width: 30 },
        { header: 'Unit Sekolah', key: 'sekolah', width: 30 },
        { header: 'Tingkat/Jenjang', key: 'grade', width: 30 },
        { header: 'Alamat Siswa', key: 'alamatsiswa', width: 30 },


        // Ayah
        { header: 'Nama Ayah', key: 'nama_ayah', width: 30 },
        { header: 'NIK Ayah', key: 'nik_ayah', width: 30 },
        { header: 'Pendidikan Terakhir Ayah', key: 'pendidikan_terakhir_ayah', width: 30 },
        { header: 'Pekerjaan Ayah', key: 'pekerjaan_ayah', width: 30 },
        { header: 'Penghasilan Ayah', key: 'penghasilan_ayah', width: 30 },
        { header: 'No Telepon Ayah', key: 'no_telepon_ayah', width: 30 },
        { header: 'No HP Ayah', key: 'no_hp_ayah', width: 30 },
        { header: 'Alamat Ayah', key: 'alamat_ayah', width: 50 },

        // Ibu
        { header: 'Nama Ibu', key: 'nama_ibu', width: 30 },
        { header: 'NIK Ibu', key: 'nik_ibu', width: 30 },
        { header: 'Pendidikan Terakhir Ibu', key: 'pendidikan_terakhir_ibu', width: 30 },
        { header: 'Pekerjaan Ibu', key: 'pekerjaan_ibu', width: 30 },
        { header: 'Penghasilan Ibu', key: 'penghasilan_ibu', width: 30 },
        { header: 'No Telepon Ibu', key: 'no_telepon_ibu', width: 30 },
        { header: 'No HP Ibu', key: 'no_hp_ibu', width: 30 },
        { header: 'Alamat Ibu', key: 'alamat_ibu', width: 50 },

        // Wali
        { header: 'Nama Wali', key: 'nama_wali', width: 30 },
        { header: 'NIK Wali', key: 'nik_wali', width: 30 },
        { header: 'Pendidikan Terakhir Wali', key: 'pendidikan_terakhir_wali', width: 30 },
        { header: 'Pekerjaan Wali', key: 'pekerjaan_wali', width: 30 },
        { header: 'Penghasilan Wali', key: 'penghasilan_wali', width: 30 },
        { header: 'No Telepon Wali', key: 'no_telepon_wali', width: 30 },
        { header: 'No HP Wali', key: 'no_hp_wali', width: 30 },
        { header: 'Alamat Wali', key: 'alamat_wali', width: 50 },
      ]

      const rows = dataRegis.map(item => ({
        code_pendaftaran: item.code_pendaftaran,
        tanggal_pendaftaran: item.tanggal_pendaftaran,
        nama_pendaftar: item.register ? `${item.register.nama_depan} ${item.register.nama_belakang || ''}`.trim() : '',
        email: item.register ? `${item.register.email}`.trim() : '',
        no_handphone: item.register ? `${item.register.no_handphone}`.trim() : '',
        nama_siswa: item.siswa ? `${item.siswa.nama_depan} ${item.siswa.nama_belakang || ''}`.trim() : '',
        jenis_kelamin : item.siswa ? `${item.siswa.jenis_kelamin}`.trim() : '',
        tempat_lahir : item.siswa ? `${item.siswa.tempat_lahir}`.trim() : '',
        tgl_lahir : item.siswa ? `${item.siswa.tgl_lahir}`.trim() : '',
        nis : item.siswa ? `${item.siswa.nis}`.trim() : '',
        nik : item.siswa ? `${item.siswa.nik}`.trim() : '',
        nisn : item.siswa ? `${item.siswa.nisn}`.trim() : '',
        sekolah : item.sekolah ? `${item.sekolah.name}`.trim() : '',
        grade : item.sekolah_grade ? `${item.sekolah_grade.name}`.trim() : '',
        alamatsiswa : item.siswa_address ?
        `${item.siswa_address.alamat || ''} RT ${item.siswa_address.rt || ''} RW ${item.siswa_address.rw || ''}, ${item.siswa_address.desa || ''}, ${item.siswa_address.district || ''}, ${item.siswa_address.kota || ''}, ${item.siswa_address.provinsi || ''}`
        : '',
        status_pendaftaran : item.status_pembayaran == '00' ? 'Menunggu Proses' :  item.status_pembayaran == '01' ?  'Diterima' : 'Ditolak',

        // Ayah
        nama_ayah: item.siswa_parent ? `${item.siswa_parent.nama_ayah || ''}`.trim() : '',
        nik_ayah: item.siswa_parent ? `${item.siswa_parent.nik_ayah || ''}`.trim() : '',
        pendidikan_terakhir_ayah: item.siswa_parent ? `${item.siswa_parent.pendidikan_terakhir_ayah || ''}`.trim() : '',
        pekerjaan_ayah: item.siswa_parent ? `${item.siswa_parent.pekerjaan_ayah || ''}`.trim() : '',
        penghasilan_ayah: item.siswa_parent ? `${item.siswa_parent.penghasilan_ayah || ''}`.trim() : '',
        no_telepon_ayah: item.siswa_parent ? `${item.siswa_parent.no_telepon_ayah || ''}`.trim() : '',
        no_hp_ayah: item.siswa_parent ? `${item.siswa_parent.no_hp_ayah || ''}`.trim() : '',
        alamat_ayah: item.siswa_parent ? `${item.siswa_parent.alamat_ayah || ''}`.trim() : '',

        // Ibu
        nama_ibu: item.siswa_parent ? `${item.siswa_parent.nama_ibu || ''}`.trim() : '',
        nik_ibu: item.siswa_parent ? `${item.siswa_parent.nik_ibu || ''}`.trim() : '',
        pendidikan_terakhir_ibu: item.siswa_parent ? `${item.siswa_parent.pendidikan_terakhir_ibu || ''}`.trim() : '',
        pekerjaan_ibu: item.siswa_parent ? `${item.siswa_parent.pekerjaan_ibu || ''}`.trim() : '',
        penghasilan_ibu: item.siswa_parent ? `${item.siswa_parent.penghasilan_ibu || ''}`.trim() : '',
        no_telepon_ibu: item.siswa_parent ? `${item.siswa_parent.no_telepon_ibu || ''}`.trim() : '',
        no_hp_ibu: item.siswa_parent ? `${item.siswa_parent.no_hp_ibu || ''}`.trim() : '',
        alamat_ibu: item.siswa_parent ? `${item.siswa_parent.alamat_ibu || ''}`.trim() : '',

        // Wali
        nama_wali: item.siswa_parent ? `${item.siswa_parent.nama_wali || ''}`.trim() : '',
        nik_wali: item.siswa_parent ? `${item.siswa_parent.nik_wali || ''}`.trim() : '',
        pendidikan_terakhir_wali: item.siswa_parent ? `${item.siswa_parent.pendidikan_terakhir_wali || ''}`.trim() : '',
        pekerjaan_wali: item.siswa_parent ? `${item.siswa_parent.pekerjaan_wali || ''}`.trim() : '',
        penghasilan_wali: item.siswa_parent ? `${item.siswa_parent.penghasilan_wali || ''}`.trim() : '',
        no_telepon_wali: item.siswa_parent ? `${item.siswa_parent.no_telepon_wali || ''}`.trim() : '',
        no_hp_wali: item.siswa_parent ? `${item.siswa_parent.no_hp_wali || ''}`.trim() : '',
        alamat_wali: item.siswa_parent ? `${item.siswa_parent.alamat_wali || ''}`.trim() : '',
      }))

      worksheet.addRows(rows)

      const fileName = `register_ppdb_${Date.now()}.xlsx`
      const filePath = Helpers.publicPath(fileName)
      await workbook.xlsx.writeFile(filePath)

      return response.send({
        success: true,
        download_url: `${baseUrl}/${fileName}`
      })

    } catch (error) {
      return response.status(500).send({
        success: false,
        message: 'Gagal membuat file Excel',
        error: error.message
      })
    }
  }


  async generateBundlePDF({ request, response }) {
    try {
      const baseUrl = Env.get('BASE_URL')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const printTimestamp = currentDate.toLocaleString('id-ID')

      const filter = request.input('filter', {})

      // Base query from DaftarUlang
      let query = DaftarUlang.query()
        .join('tbl_register_ppdbs', 'tbl_register_ppdbs.id', 'tbl_daftar_ulangs.register_id')
        .select('tbl_daftar_ulangs.*', 'tbl_register_ppdbs.*') // select all base columns

      // Apply filters
      if (filter.status) {
        if (filter.status === 'Diterima') {
          query.where('tbl_daftar_ulangs.status_pembayaran', '01')
        } else if (filter.status === 'Dalam Proses') {
          query.where('tbl_daftar_ulangs.status_pembayaran', '00')
        } else if (filter.status === 'Ditolak') {
          query.where('tbl_daftar_ulangs.status_pembayaran', '02')
        }
      }

      if (filter.tahun_periodik) {
        query.where('tbl_register_ppdbs.tahun_periodik', filter.tahun_periodik);
      }

      // Execute
      query = await query.fetch()
      const dataRegis = query.toJSON()

      await Promise.all(dataRegis.map(async (item, index) => {
        const dataSiswa = await SiswaPpdb.query()
          .where('id', item.siswa_id)
          .first()

        const dataSiswaAward = await SiswaAward.query()
          .where('siswa_id', item.siswa_id)
          .first()

        const dataSekolah = await Sekolah.query()
          .where('id', item.sekolah_id)
          .first()

        const dataSekolahGrade = await SekolahGrade.query()
          .where('id', item.grade_id)
          .first()

        const dataSiswaAddress = await RegAddress.query()
          .select(
            'tbl_register_ppdb_addresses.*',
            'indonesia_provinces.name as provinsi',
            'indonesia_cities.name as kota',
            'indonesia_districts.name as district',
            'indonesia_villages.name as desa'
          )
          .joinRaw(`JOIN indonesia_provinces ON CONVERT(indonesia_provinces.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.provinsi_id`)
          .joinRaw(`JOIN indonesia_cities ON CONVERT(indonesia_cities.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.city_id`)
          .joinRaw(`JOIN indonesia_districts ON CONVERT(indonesia_districts.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.district_id`)
          .joinRaw(`JOIN indonesia_villages ON CONVERT(indonesia_villages.code USING utf8mb4) COLLATE utf8mb4_general_ci = tbl_register_ppdb_addresses.subdistrict_id`)
          .where('tbl_register_ppdb_addresses.register_id', item.register_id)
          .first()

        const dataRegister = await User.query()
          .where('id', item.registed_by)
          .first()

        const dataSiswaOrtu = await RegParent.query()
          .where('register_id', item.register_id)
          .first()

        const dataPayment = await Payment.query()
          .where('register_id', item.register_id)
          .first()

        // siswa
        const siswa = dataSiswa?.toJSON() || null
        if (siswa) {
          const today = new Date()
          const birth = new Date(siswa.tgl_lahir)
          let usia = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            usia--
          }
          siswa.usia = usia
          siswa.tgl_lahir = formatDate(siswa.tgl_lahir)
          siswa.foto_siswa = siswa.foto_siswa
            ? `${baseUrl}/uploads/foto_siswa/${siswa.foto_siswa}`
            : null
        }

        // awards
        const siswaAwards = dataSiswaAward?.toJSON() || null
        if (siswaAwards) {
          siswaAwards.tgl_didapat = formatDate(siswaAwards.tgl_didapat)
          siswaAwards.image = siswaAwards.image
            ? `${baseUrl}/uploads/award_siswa/${siswaAwards.image}`
            : null
        }

        // payment
        const PaymentData = dataPayment?.toJSON() || null
        if (PaymentData) {
          PaymentData.tanggal_transaksi = formatDate(PaymentData.tanggal_transaksi)
          PaymentData.bukti_transfer = PaymentData.bukti_transfer
            ? `${baseUrl}/uploads/payment/${PaymentData.bukti_transfer}`
            : null
        }

        // attach enriched data
        dataRegis[index].siswa = siswa
        dataRegis[index].siswa_award = siswaAwards
        dataRegis[index].siswa_address = dataSiswaAddress?.toJSON() || null
        dataRegis[index].siswa_parent = dataSiswaOrtu?.toJSON() || null
        dataRegis[index].payment = PaymentData
        dataRegis[index].tgl_test = dataRegis[index].tgl_test
          ? formatDateNormal(dataRegis[index].tgl_test)
          : null
        dataRegis[index].register = dataRegister?.toJSON() || null
        dataRegis[index].sekolah = dataSekolah?.toJSON() || null
        dataRegis[index].sekolah_grade = dataSekolahGrade?.toJSON() || null
        dataRegis[index].file_raport = dataRegis[index].file_raport
          ? `${baseUrl}/uploads/ppdb/raport/${dataRegis[index].file_raport}`
          : null
        dataRegis[index].file_akte_lahir = dataRegis[index].file_akte_lahir
          ? `${baseUrl}/uploads/ppdb/akte_lahir/${dataRegis[index].file_akte_lahir}`
          : null

        dataRegis[index].bukti_pembayaran = dataRegis[index].bukti_pembayaran
          ? `${baseUrl}/uploads/ppdb/bukti_pembayaran_reg_ulang/${dataRegis[index].bukti_pembayaran}`
          : null
        dataRegis[index].file_kartu_keluarga = dataRegis[index].file_kartu_keluarga
          ? `${baseUrl}/uploads/ppdb/kartu_keluarga/${dataRegis[index].file_kartu_keluarga}`
          : null
      }))

      const dataProfileSekolah = await WebProfile.first()
      const kopSuratUrl = dataProfileSekolah?.kopsurat ? `${baseUrl}/uploads/web_profile/${dataProfileSekolah.kopsurat}` : null
      const logo = `${baseUrl}/uploads/logo.png`

      const dirPath = Helpers.publicPath('pdfs')
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

      const tempDir = `${dirPath}/temp_${uuid.v4()}`
      fs.mkdirSync(tempDir)

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      // Fungsi untuk mengamankan nama file
      const sanitize = str => str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "_")

      for (let row of dataRegis) {
        const birth = formatDateNormal(row.siswa?.tgl_lahir)
        const petugas = await User.find(row.petugas_id)

        const html = await View.render('pdfs.print_suket_ppdb', {
          data: row,
          currentYear,
          printTimestamp,
          kopSuratUrl,
          logo,
          birth,
          petugas
        })

        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfFilename = `${row.code_pendaftaran}_${sanitize(row.siswa?.nama_depan + row.siswa?.nama_belakang || 'noname')}.pdf`
        const pdfPath = `${tempDir}/${pdfFilename}`

        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
        })

        await page.close()
      }

      await browser.close()

      const zipFilename = `bundle_${uuid.v4()}.zip`
      const zipPath = `${dirPath}/${zipFilename}`

      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          const downloadUrl = `${baseUrl}/pdfs/${zipFilename}`
          resolve(response.json({
            success: true,
            download_url: downloadUrl
          }))
        })

        archive.on('error', err => reject(err))
        archive.pipe(output)
        archive.directory(tempDir, false)
        archive.finalize()
      })

    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to generate PDF bundle',
        error: error.message
      })
    }
  }

}

module.exports = GenerateReportDaftarController
