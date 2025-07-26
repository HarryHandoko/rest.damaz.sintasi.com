'use strict'
const RegisterPPDB = use('App/Models/PPDB/RegisterPpdb')
const SiswaPpdb = use('App/Models/PPDB/SiswaPpdb')
const SiswaAward = use('App/Models/PPDB/SiswaAward')
const RegAddress = use('App/Models/PPDB/RegAddress')
const RegParent = use('App/Models/PPDB/RegParent')
const Payment = use('App/Models/PPDB/Payment')

const Sekolah = use('App/Models/MasterData/Sekolah')
const SekolahGrade = use('App/Models/MasterData/SekolahGrade')
const moment = require('moment')
const Database = use('Database'); // Adonis v4
const Env = use('Env') // for Adonis 4.x

const formatDate = (date) => {
  if (!date) return null
  // Pastikan date bertipe Date, jika bukan, parse dulu
  const d = new Date(date)
  // Hasilnya string "YYYY-MM-DD"
  return d.toISOString().slice(0, 10)
}

class RegisterController {
  async create({ request, response, auth }) {
    const trx = await Database.beginTransaction();
    try {
      // generate code di dalam transaction

      const now = new Date();
      const tanggal = moment(now).format('DDMMYYYY');
      const prefix = `RPDB${tanggal}`;
      // Query pada transaction
      const lastRegister = await RegisterPPDB
        .query(trx)
        .where('code_pendaftaran', 'like', `${prefix}%`)
        .orderBy('code_pendaftaran', 'desc')
        .first();

      let nomorUrut = 1;
      if (lastRegister) {
        const lastKode = lastRegister.code_pendaftaran;
        const lastNomorUrut = parseInt(lastKode.substr(-4), 10);
        nomorUrut = lastNomorUrut + 1;
      }
      const nomorUrutStr = nomorUrut.toString().padStart(4, '0');
      const kodePendaftaran = `${prefix}${nomorUrutStr}`;

      const SiswaId = await SiswaPpdb.create({
        registed_by : auth.user.id
      }, trx);

      const data = {
        code_pendaftaran: kodePendaftaran,
        registed_by: auth.user.id,
        siswa_id: SiswaId.id,
        status_pendaftaran : "P00"
      };
      const RegisterID = await RegisterPPDB.create(data, trx);

      await trx.commit();
      return response.json({
        status_code: '200',
        status: 'success',
        message: 'Pendaftaran berhasil, silahkan login',
        data : data
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    }
  }

  async updateForm ({request, response, auth}) {
     const trx = await Database.beginTransaction();
     try {
      const updatePPDB = await RegisterPPDB.query().where('code_pendaftaran',request.input('code_ppdb')).first();

      if(request.input('step') == "1"){
        const SekolahData = await Sekolah.query().where('id',request.input('sekolah_id')).first();

        updatePPDB.sekolah_id = request.input('sekolah_id');
        updatePPDB.grade_id = request.input('grade_id');
        updatePPDB.tanggal_pendaftaran = new Date().toISOString().slice(0, 10);
        updatePPDB.biaya_admin = SekolahData.biaya_admin;
        updatePPDB.biaya_pendaftaran = SekolahData.biaya_pendaftaran;
        updatePPDB.save();
      }else if(request.input('step') == "2"){
        const getSiswaPPDB = await SiswaPpdb.query().where('id',updatePPDB.siswa_id).first();
        getSiswaPPDB.nama_depan = request.input('nama_depan');
        getSiswaPPDB.nama_belakang = request.input('nama_belakang');
        getSiswaPPDB.tgl_lahir = request.input('tgl_lahir');
        getSiswaPPDB.tempat_lahir = request.input('tempat_lahir');
        getSiswaPPDB.jenis_kelamin = request.input('jenis_kelamin');
        getSiswaPPDB.nisn = request.input('nisn');
        getSiswaPPDB.bahasa_sehari_hari = request.input('bahasa_sehari_hari');
        getSiswaPPDB.kebutuhan_spesial = request.input('kebutuhan_spesial') == 'true' ? '1' : '0';

        // Foto Siswa
        const fotoSiswa = request.file('foto_siswa', {
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        });

        if (fotoSiswa) {
          const fileName = `${Date.now()}.${fotoSiswa.extname}`;
          await fotoSiswa.move('public/uploads/foto_siswa', {
            name: fileName,
            overwrite: true
          });
          getSiswaPPDB.foto_siswa = fileName;
        }
        getSiswaPPDB.save();

        if(request.input('award') == 'Ada'){
          const cekAward = await SiswaAward.query().where('siswa_id',updatePPDB.siswa_id).first();
          if(!cekAward){
            const dataAward = {
              siswa_id : updatePPDB.siswa_id,
              award : request.input('award_name'),
              tgl_didapat : request.input('award_date'),
            }
            const award_image = request.file('award_image', {
              extnames: ['jpg', 'jpeg', 'png', 'webp'],
            });

            if (award_image) {
              const fileName = `${Date.now()}.${award_image.extname}`;
              await award_image.move('public/uploads/award_siswa', {
                name: fileName,
                overwrite: true
              });
              dataAward.image = fileName;
            }

            await SiswaAward.create(dataAward)
          }else{
            const award_image = request.file('award_image', {
              extnames: ['jpg', 'jpeg', 'png', 'webp'],
            });

            if (award_image) {
              const fileName = `${Date.now()}.${award_image.extname}`;
              await award_image.move('public/uploads/award_siswa', {
                name: fileName,
                overwrite: true
              });
              cekAward.image = fileName;
            }
            cekAward.siswa_id = updatePPDB.siswa_id;
            cekAward.award = request.input('award_name');
            cekAward.tgl_didapat = request.input('award_date');

            await cekAward.save()
          }
        }

        // file_raport
        const fileRaport = request.file('file_raport', {
          extnames: ['jpg', 'jpeg', 'png', 'webp','pdf'],
        });

        if (fileRaport) {
          const fileName = `${Date.now()}.${fileRaport.extname}`;
          await fileRaport.move('public/uploads/ppdb/raport', {
            name: fileName,
            overwrite: true
          });
          updatePPDB.file_raport = fileName;
        }
        // file_akte_lahir
        const fileAkteLahir = request.file('file_akte_lahir', {
          extnames: ['jpg', 'jpeg', 'png', 'webp','pdf'],
        });

        if (fileAkteLahir) {
          const fileName = `${Date.now()}.${fileAkteLahir.extname}`;
          await fileAkteLahir.move('public/uploads/ppdb/akte_alhir', {
            name: fileName,
            overwrite: true
          });
          updatePPDB.file_akte_lahir = fileName;
        }

        // file_kartu_keluarga
        const fileKartuKeluarga = request.file('file_kartu_keluarga', {
          extnames: ['jpg', 'jpeg', 'png', 'webp','pdf'],
        });

        if (fileKartuKeluarga) {
          const fileName = `${Date.now()}.${fileKartuKeluarga.extname}`;
          await fileKartuKeluarga.move('public/uploads/ppdb/kartu_keluarga', {
            name: fileName,
            overwrite: true
          });
          updatePPDB.file_kartu_keluarga = fileName;
        }

        updatePPDB.status_pendaftaran_siswa = request.input('status_pendaftaran_siswa');
        updatePPDB.nem = request.input('nilai_nem');
        updatePPDB.save();
      }else if(request.input('step') == '3'){
        const cekData = await RegAddress.query().where('register_id',updatePPDB.id).first();
        if(!cekData){
          const data = {
            register_id : updatePPDB.id,
            alamat : request.input('alamat_siswa'),
            rt : request.input('rt_siswa'),
            rw : request.input('rw_siswa'),
            provinsi_id : request.input('provinsi_id_siswa'),
            city_id : request.input('city_id_siswa'),
            district_id : request.input('district_id_siswa'),
            subdistrict_id : request.input('subdistrict_id_siswa'),
            zip_code : request.input('zip_code_siswa'),
          }
          RegAddress.create(data);
        }else{

          cekData.alamat = request.input('alamat_siswa');
          cekData.rt = request.input('rt_siswa');
          cekData.rw = request.input('rw_siswa');
          cekData.provinsi_id = request.input('provinsi_id_siswa');
          cekData.city_id = request.input('city_id_siswa');
          cekData.district_id = request.input('district_id_siswa');
          cekData.subdistrict_id = request.input('subdistrict_id_siswa');
          cekData.zip_code = request.input('zip_code_siswa');
          cekData.save()
        }
      }else if(request.input('step') == '4'){
        const cekData = await RegParent.query().where('register_id',updatePPDB.id).first();
        if(!cekData){
          const data = {
            register_id : updatePPDB.id,
            nama_ayah : request.input('nama_ayah'),
            pekerjaan_ayah : request.input('pekerjaan_ayah'),
            pendidikan_terakhir_ayah : request.input('pendidikan_terakhir_ayah'),
            penghasilan_ayah : request.input('penghasilan_ayah'),
            nama_ibu : request.input('nama_ibu'),
            pekerjaan_ibu : request.input('pekerjaan_ibu'),
            pendidikan_terakhir_ibu : request.input('pendidikan_terakhir_ibu'),
            penghasilan_ibu : request.input('penghasilan_ibu'),
          }
          RegParent.create(data);
        }else{

          cekData.nama_ayah = request.input('nama_ayah');
          cekData.pekerjaan_ayah = request.input('pekerjaan_ayah');
          cekData.pendidikan_terakhir_ayah = request.input('pendidikan_terakhir_ayah');
          cekData.penghasilan_ayah = request.input('penghasilan_ayah');
          cekData.nama_ibu = request.input('nama_ibu');
          cekData.pekerjaan_ibu = request.input('pekerjaan_ibu');
          cekData.pendidikan_terakhir_ibu = request.input('pendidikan_terakhir_ibu');
          cekData.penghasilan_ibu = request.input('penghasilan_ibu');
          cekData.save()
        }
      }else if(request.input('step') == '5'){
        const cekData = await Payment.query().where('register_id',updatePPDB.id).first();

        const bukti_transaksi = request.file('bukti_transaksi', {
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        });
        if(!cekData){
          const data = {
            register_id : updatePPDB.id,
            tanggal_transaksi : new Date().toISOString().split('T')[0],
          }

          if (bukti_transaksi) {
            const fileName = `${Date.now()}.${bukti_transaksi.extname}`;
            await bukti_transaksi.move('public/uploads/payment', {
              name: fileName,
              overwrite: true
            });
            data.bukti_transfer = fileName;
          }
          Payment.create(data);

          updatePPDB.is_submit = '1';
          updatePPDB.save();
        }else{
          if (bukti_transaksi) {
            const fileName = `${Date.now()}.${bukti_transaksi.extname}`;
            await bukti_transaksi.move('public/uploads/payment', {
              name: fileName,
              overwrite: true
            });
            cekData.bukti_transfer = fileName;
          }
          cekData.save()
        }
      }

      await trx.commit();

      return response.json({
        status_code: '200',
        status: 'success',
        message: 'Update berhasil',
        data : updatePPDB
      });
     } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
     }
  }

  async getData({ request, response, auth }) {
    try {
      const baseUrl = Env.get('BASE_URL')
      let data = await RegisterPPDB.query()
        .where('registed_by', auth.user.id)
        .fetch()
      if(request.input('register_id')){
        data = await RegisterPPDB.query()
        .where('registed_by', auth.user.id)
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


        const dataSiswaAddress = await RegAddress.query()
          .where('register_id', item.id)
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


  async delete({ request, response }) {
    try {
      const { code_pendaftaran, siswa_id } = request.only(['code_pendaftaran', 'siswa_id']);

      const data = await RegisterPPDB.query()
        .where('code_pendaftaran', code_pendaftaran)
        .first();

      if (!data) {
        return response.status(404).json({ message: 'Data pendaftaran tidak ditemukan' });
      }

      const dataSiswa = await SiswaPpdb.findOrFail(siswa_id);

      const dataAward = await SiswaAward.query().where('siswa_id', dataSiswa.id).first();
      const dataAddress = await RegAddress.query().where('register_id', data.id).first();
      const dataParrent = await RegParent.query().where('register_id', data.id).first();
      const dataPayment = await Payment.query().where('register_id', data.id).first();

      // Delete data jika ada
      if (dataAward) await dataAward.delete();
      if (dataAddress) await dataAddress.delete();
      if (dataParrent) await dataParrent.delete();
      if (dataPayment) await dataPayment.delete();
      await dataSiswa.delete();
      await data.delete();

      return response.status(200).json({
        message: 'Data deleted successfully'
      });

    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting data',
        error: error.message
      });
    }
  }


}

module.exports = RegisterController
