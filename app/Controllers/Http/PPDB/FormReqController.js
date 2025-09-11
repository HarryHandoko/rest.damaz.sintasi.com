'use strict'
const RegisterPPDB = use("App/Models/PPDB/RegisterPpdb");
const SiswaPpdb = use("App/Models/PPDB/SiswaPpdb");
const Payment = use("App/Models/PPDB/Payment");
const User = use("App/Models/User");
const Sekolah = use("App/Models/MasterData/Sekolah");
const SekolahGrade = use("App/Models/MasterData/SekolahGrade");
const Diskon = use("App/Models/Master/Diskon");

const moment = require("moment");
const Database = use("Database"); // Adonis v4
const Env = use("Env"); // for Adonis 4.x

const formatDate = (date) => {
  if (!date) return null;
  // Pastikan date bertipe Date, jika bukan, parse dulu
  const d = new Date(date);
  // Hasilnya string "YYYY-MM-DD"
  return d.toISOString().slice(0, 10);
};
const formatDateNormal = (date) => {
  if (!date) return null;

  const d = new Date(date);

  // Ambil hari, bulan, tahun
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // bulan dimulai dari 0
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


class FormReqController {
  async getdata({request, response, auth}){
    try {

      const baseUrl = Env.get("BASE_URL");
      const filter = request.input("filter", {});

      let query = RegisterPPDB.query().where('is_submit',1);

      if (filter.status) {
        if (filter.status === "Diterima") {
          query.where("status_pendaftaran", "P01");
        } else if (filter.status === "Ditolak") {
          query.where("status_pendaftaran", "P02");
        } else if (filter.status === "Dalam Proses") {
          query.where("status_pendaftaran", "P00");
        }
      }

      if (filter.tahun_periodik) {
        query.where('tahun_periodik',filter.tahun_periodik);
      }

      const data = await query.fetch();
      const dataRegis = data.toJSON();

      await Promise.all(
        dataRegis.map(async (item, index) => {
          const dataSiswa = await SiswaPpdb.query()
            .where("id", item.siswa_id)
            .first();


          const dataPayment = await Payment.query()
            .where("register_id", item.id)
            .first();

          const PaymentData = dataPayment?.toJSON() || null;
          if (PaymentData != null) {
            PaymentData.tanggal_transaksi = formatDate(
              PaymentData.tanggal_transaksi
            );
            PaymentData.bukti_transfer = PaymentData.bukti_transfer
              ? `${baseUrl}/uploads/payment/${PaymentData.bukti_transfer}`
              : null;
          }

          let dataDiskon = await Diskon.query()
            .where("id", item.diskon_id)
            .first();

          if (dataDiskon) {
            dataRegis[index].voucher_diskon = dataDiskon.kode;
            dataRegis[index].nominal_diskon = dataDiskon.nominal;
          }else{

            dataRegis[index].voucher_diskon = '-';
            dataRegis[index].nominal_diskon = 0;
          }


          const dataRegister = await User.query()
            .where("id", item.registed_by)
            .first();

          const dataSekolah = await Sekolah.query()
            .where("id", item.sekolah_id)
            .first();

          const dataSekolahGrade = await SekolahGrade.query()
            .where("id", item.grade_id)
            .first();



          dataRegis[index].siswa = dataSiswa;
          dataRegis[index].payment = PaymentData;
          dataRegis[index].register = dataRegister?.toJSON() || null;
          dataRegis[index].sekolah = dataSekolah?.toJSON() || null;
          dataRegis[index].sekolah_grade = dataSekolahGrade?.toJSON() || null;

        })
      );

      return response.json({
        status_code: "200",
        data: dataRegis, // ini sekarang sudah punya siswa.usia
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  }

  async approval ({request,response}){
    try {

      const dataPPDB = await RegisterPPDB.query().where('id',request.input('id')).first();

      if(request.input('status') == 1){
        dataPPDB.is_form_done = 1;
        dataPPDB.save();
      }else if(request.input('status') == 2){
        dataPPDB.is_form_done = 2;
        dataPPDB.save();
      }

      return response.json({
        status_code: "200",
        message : 'Berhasil merubah status formulir',
        data : dataPPDB
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: "Server error",
        error: error.message,
      });
    }
  }
}

module.exports = FormReqController
