'use strict'
const RegisterPPDB = use('App/Models/PPDB/RegisterPpdb')
const SiswaPpdb = use('App/Models/PPDB/SiswaPpdb')
const SiswaAward = use('App/Models/PPDB/SiswaAward')
const RegAddress = use('App/Models/PPDB/RegAddress')
const RegParent = use('App/Models/PPDB/RegParent')
const Payment = use('App/Models/PPDB/Payment')
const DaftarUlang = use('App/Models/PPDB/DaftarUlang')
const Sekolah = use('App/Models/MasterData/Sekolah')
const User = use('App/Models/User')
const SekolahGrade = use('App/Models/MasterData/SekolahGrade')

const Database = use('Database'); // Adonis v4
const Env = use('Env') // for Adonis 4.x
const moment = require('moment')
const View = use('View')
const puppeteer = require('puppeteer')
const Helpers = use('Helpers')
const fs = require('fs')
const uuid = require('uuid') // To generate unique file names
const { register } = require('module')
const EmailService = use('App/Services/EmailService')

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

class ProsesTestController {

  async getData({ request, response, auth }) {
      try {
        const baseUrl = Env.get('BASE_URL')
        let data = await RegisterPPDB.query()
          .where('is_need_test','1')
          .where('status_pendaftaran','P01')
          .fetch()
        if(request.input('register_id')){
          data = await RegisterPPDB.query()
          .where('code_pendaftaran', request.input('register_id'))
          .fetch()
        }

        const dataRegis = data.toJSON()

        await Promise.all(dataRegis.map(async (item, index) => {
          const dataSiswa = await SiswaPpdb.query()
            .where('registed_by', auth.user.id)
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


          const dataRegistrasiUlang = await DaftarUlang.query()
            .where('register_id', item.id)
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
          .where('tbl_register_ppdb_addresses.register_id', item.id)
          .first()


          const dataRegister = await User.query()
            .where('id', item.registed_by)
            .first()

          const dataSiswaOrtu = await RegParent.query()
            .where('register_id', item.id)
            .first()
          const dataPayment = await Payment.query()
            .where('register_id', item.id)
            .first()

          // Konversi siswa ke JSON
          const siswa = dataSiswa.toJSON()

          // Hitung usia langsung
          const today = new Date()
          const birth = new Date(siswa.tgl_lahir)
          let usia = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            usia--
          }
          siswa.usia = usia
          siswa.tgl_lahir = formatDate(siswa.tgl_lahir);

          siswa.foto_siswa = siswa.foto_siswa
          ? `${baseUrl}/uploads/foto_siswa/${siswa.foto_siswa}`
          : null

          const siswaAwards = dataSiswaAward?.toJSON() || null;
          if(siswaAwards != null){
            siswaAwards.tgl_didapat = formatDate(siswaAwards.tgl_didapat);
            siswaAwards.image = siswaAwards.image
            ? `${baseUrl}/uploads/award_siswa/${siswaAwards.image}`
            : null
          }

          const siswaAddress = dataSiswaAddress?.toJSON() || null;
          const siswaOru = dataSiswaOrtu?.toJSON() || null;


          const PaymentData = dataPayment?.toJSON() || null;
          if(PaymentData != null){
            PaymentData.tanggal_transaksi = formatDate(PaymentData.tanggal_transaksi);
            PaymentData.bukti_transfer = PaymentData.bukti_transfer
            ? `${baseUrl}/uploads/payment/${PaymentData.bukti_transfer}`
            : null
          }

          // Tambahkan ke item (update langsung ke dataRegis[index])
          dataRegis[index].siswa = siswa
          dataRegis[index].siswa_award = siswaAwards
          dataRegis[index].siswa_address = siswaAddress
          dataRegis[index].siswa_parent = siswaOru
          dataRegis[index].payment = PaymentData

          dataRegis[index].tgl_test = dataRegis[index].tgl_test != null ? formatDateNormal(dataRegis[index].tgl_test) : null;
          dataRegis[index].register = dataRegister?.toJSON() || null
          // dataRegis[index].registrasi_ulang = dataRegistrasiUlang?.toJSON() || null
          dataRegis[index].sekolah = dataSekolah?.toJSON() || null
          dataRegis[index].sekolah_grade = dataSekolahGrade?.toJSON() || null
          dataRegis[index].file_raport = dataRegis[index].file_raport
            ? `${baseUrl}/uploads/ppdb/raport/${dataRegis[index].file_raport}`
            : null
          dataRegis[index].file_akte_lahir = dataRegis[index].file_akte_lahir
            ? `${baseUrl}/uploads/ppdb/akte_lahir/${dataRegis[index].file_akte_lahir}`
            : null
          dataRegis[index].file_kartu_keluarga = dataRegis[index].file_kartu_keluarga
            ? `${baseUrl}/uploads/ppdb/kartu_keluarga/${dataRegis[index].file_kartu_keluarga}`
            : null
        }))

        return response.json({
          status_code: '200',
          data: dataRegis // ini sekarang sudah punya siswa.usia
        })
      } catch (error) {
        return response.status(500).json({
          status: 'error',
          message: 'Server error',
          error: error.message
        })
      }
    }



    async statistik({ response ,auth}) {
    try {
      const dataUser = await User.query()
      .select('roles.name as role_name','tbl_users.*')
      .join('roles','roles.id','tbl_users.role_id')
      .where('tbl_users.id',auth.user.id).first();
      // .count() returns an array with string value, so we extract and convert to number
      const totalPendaftar = await RegisterPPDB.query().where('is_need_test','1').where('is_submit', '1').count()
      const totalDiterima = await RegisterPPDB.query().where('is_need_test','1').where('status_test', '01').where('is_submit', '1').count()
      const totalDitolak = await RegisterPPDB.query().where('is_need_test','1').where('status_test', '02').where('is_submit', '1').count()
      const totalDalamProses = await RegisterPPDB.query().where('is_need_test','1').where('status_test', '00').where('is_submit', '1').count()

      return response.json({
        success: true,
        data: {
          total: Number(totalPendaftar[0]['count(*)']),
          diterima: Number(totalDiterima[0]['count(*)']),
          ditolak: Number(totalDitolak[0]['count(*)']),
          diproses: Number(totalDalamProses[0]['count(*)']),
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      })
    }
  }



  async Approval({ response, request , auth}) {
    try {
      const code = request.input('code_ppdb')
      const siswa_id = request.input('siswa_id')
      const type = request.input('type') // 'Approve' atau 'Reject'

      const data = await RegisterPPDB
        .query()
        .where('is_submit', '1')
        .where('code_pendaftaran', code)
        .first()

      if (!data) {
        return response.status(404).json({
          success: false,
          message: 'Pendaftaran tidak terdaftar',
        })
      }

      const payment = await Payment.query().where('register_id', data.id).first()
      const user = await User.find(data.registed_by)
      const dataSiswa = await SiswaPpdb.query().where('id', data.siswa_id).firstOrFail()
      const dataSekolah = await Sekolah.query().where('id', data.sekolah_id).firstOrFail()
      const dataSekolahGrade = await SekolahGrade.query().where('id', data.grade_id).firstOrFail()
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
        .where('tbl_register_ppdb_addresses.register_id', data.id)
        .first()

      if (type === 'Approve') {
        data.status_test = '01';

        // Kirim Email
        if (user && user.email) {
          const emailHtml = `
            <h2>Halo ${user.nama_depan},</h2>

            <p>
              dari hasil tes seleksi yang dilakukan, siswa dibawah ini :
            </p>

            <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse; font-family: sans-serif;">
              <tr>
                <td><strong>Nama Siswa</strong></td>
                <td>: ${dataSiswa.nama_depan + ' ' +  dataSiswa.nama_belakang || '-'}</td>
              </tr>
              <tr>
                <td><strong>Sekolah</strong></td>
                <td>: ${dataSekolah.name || '-'}</td>
              </tr>
              <tr>
                <td><strong>Jejang</strong></td>
                <td>: ${dataSekolahGrade.name || '-'}</td>
              </tr>
              <tr>
                <td><strong>Kode Pendaftaran</strong></td>
                <td>: ${data.code_pendaftaran}</td>
              </tr>
              <tr>
                <td><strong>Tempat, Tanggal Lahir</strong></td>
                <td>: ${dataSiswa.tempat_lahir || '-'},  ${moment(dataSiswa.tgl_lahir).locale('id').format('D MMMM YYYY')}</td>
              </tr>
              <tr>
                <td><strong>Alamat</strong></td>
                <td>: ${dataSiswaAddress.alamat || '-'}</td>
              </tr>
            </table>
            <p>telah dinyatakan <strong>LULUS</strong></p>
            <p>Silakan lanjutkan proses berikutnya melalui portal PPDB kami.</p>

            <br>

            <p>Salam,<br><strong>Tim PPDB SDIT Darul Maza</strong></p>
          `

          await EmailService.send(user.email, 'Pengumuman Hasil Tes Seleksi', emailHtml)
        }
      } else if (type === 'Reject') {
        data.status_test = '02'

        const fullName =
          (dataSiswa.nama_depan || '') + ' ' + (dataSiswa.nama_belakang || '')

        const emailHtml = `
          <h2>Halo ${user.nama_depan},</h2>

          <p>
            Mohon maaf, hasil dari tes seleksi siswa dibawah ini:
          </p>

          <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse; font-family: sans-serif;">
            <tr>
              <td><strong>Nama Siswa</strong></td>
              <td>: ${fullName.trim() || '-'}</td>
            </tr>
            <tr>
              <td><strong>Sekolah</strong></td>
              <td>: ${dataSekolah?.name || '-'}</td>
            </tr>
            <tr>
              <td><strong>Jenjang</strong></td>
              <td>: ${dataSekolahGrade?.name || '-'}</td>
            </tr>
            <tr>
              <td><strong>Kode Pendaftaran</strong></td>
              <td>: ${data.code_pendaftaran}</td>
            </tr>
            <tr>
              <td><strong>Tempat, Tanggal Lahir</strong></td>
              <td>: ${dataSiswa.tempat_lahir || '-'}, ${moment(dataSiswa.tgl_lahir).locale('id').format('D MMMM YYYY')}</td>
            </tr>
            <tr>
              <td><strong>Alamat</strong></td>
              <td>: ${dataSiswaAddress?.alamat || '-'}</td>
            </tr>
          </table>
          <p>dinyatkan <strong>TIDAK LULUS</strong></p>
          <p>Silakan hubungi tim kami melalui portal PPDB jika Anda membutuhkan klarifikasi lebih lanjut.</p>

          <br>

          <p>Salam,<br><strong>Tim PPDB SDIT Darul Maza</strong></p>
        `

        await EmailService.send(user.email, 'Pengumuman Hasil Tes Seleksi', emailHtml)

      } else {
        return response.status(400).json({
          success: false,
          message: 'Tipe approval tidak valid. Gunakan "Approve" atau "Reject".',
        })
      }

      await data.save()
      if (payment) await payment.save()

      return response.status(200).json({
        success: true,
        message: `Pendaftaran berhasil di-${type === 'Approve' ? 'setujui' : 'tolak'}`,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        error: error.message,
      })
    }
  }

}

module.exports = ProsesTestController
