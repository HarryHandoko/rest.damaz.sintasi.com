"use strict";
const RegisterPPDB = use("App/Models/PPDB/RegisterPpdb");
const SiswaPpdb = use("App/Models/PPDB/SiswaPpdb");
const Payment = use("App/Models/PPDB/Payment");
const User = use("App/Models/User");
const Sekolah = use("App/Models/MasterData/Sekolah");
const WhatsappBackgroundService = use("App/Services/WhatsappBackgroundService");
const SekolahGrade = use("App/Models/MasterData/SekolahGrade");
const Diskon = use("App/Models/Master/Diskon");
const RegParent = use("App/Models/PPDB/RegParent");

const moment = require("moment");
const Database = use("Database"); // Adonis v4
const Env = use("Env"); // for Adonis 4.x
const pusher = use("App/Services/Pusher");

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  async getdata({ request, response, auth }) {
    try {
      const baseUrl = Env.get("BASE_URL");
      const filter = request.input("filter", {});

      let query = RegisterPPDB.query()
        .where("is_submit", 1)
        .join(
          "tbl_register_ppdb_siswas as siswa",
          "siswa.id",
          "tbl_register_ppdbs.siswa_id",
        )
        .select("tbl_register_ppdbs.*");

      if (filter.keyword) {
        query.where((builder) => {
          builder
            .where("siswa.nama_depan", "like", `%${filter.keyword}%`)
            .orWhere("siswa.nama_belakang", "like", `%${filter.keyword}%`)
            .orWhere(
              "tbl_register_ppdbs.code_pendaftaran",
              "like",
              `%${filter.keyword}%`,
            );
        });
      }

      if (filter.status) {
        if (filter.status === "Diterima") {
          query.where("status_pendaftaran", "P01");
        } else if (filter.status === "Ditolak") {
          query.where("status_pendaftaran", "P02");
        } else if (filter.status === "Dalam Proses") {
          query.where("status_pendaftaran", "P00");
        }
      }

      if (filter.sekolah_id) {
        query.where("sekolah_id", filter.sekolah_id);
      }

      if (filter.grade_id) {
        query.where("grade_id", filter.grade_id);
      }

      if (filter.tahun_periodik) {
        query.where("tahun_periodik", filter.tahun_periodik);
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
              PaymentData.tanggal_transaksi,
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
          } else {
            dataRegis[index].voucher_diskon = "-";
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

          const dataSiswaOrtu = await RegParent.query()
            .where("register_id", item.id)
            .first();

          // Konversi Ortu JSON
          let dataOrtuWali = null;

          if (dataSiswaOrtu != null) {
            dataOrtuWali = dataSiswaOrtu.toJSON();
            dataOrtuWali.ktp_ayah = dataOrtuWali.ktp_ayah
              ? `${baseUrl}/uploads/ppdb/ktp_ayah/${dataOrtuWali.ktp_ayah}`
              : null;
            dataOrtuWali.ktp_ibu = dataOrtuWali.ktp_ibu
              ? `${baseUrl}/uploads/ppdb/ktp_ibu/${dataOrtuWali.ktp_ibu}`
              : null;

            dataOrtuWali.ktp_wali = dataOrtuWali.ktp_wali
              ? `${baseUrl}/uploads/ppdb/ktp_wali/${dataOrtuWali.ktp_wali}`
              : null;
          }

          dataRegis[index].siswa = dataSiswa;
          dataRegis[index].payment = PaymentData;
          dataRegis[index].register = dataRegister?.toJSON() || null;
          dataRegis[index].sekolah = dataSekolah?.toJSON() || null;
          dataRegis[index].sekolah_grade = dataSekolahGrade?.toJSON() || null;
          dataRegis[index].siswa_parent = dataOrtuWali;
        }),
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

  async approval({ request, response }) {
    try {
      const dataPPDB = await RegisterPPDB.query()
        .where("id", request.input("id"))
        .first();

      if (request.input("status") == 1) {
        dataPPDB.is_form_done = 1;

        dataPPDB.save();
        WhatsappBackgroundService.fireAndForgetWithRetry(
          "sendPendaftaranFormulirDisetujui",
          dataPPDB.code_pendaftaran,
          3,
        );
      } else if (request.input("status") == 2) {
        dataPPDB.is_form_done = 2;
        dataPPDB.save();
        WhatsappBackgroundService.fireAndForgetWithRetry(
          "sendPendaftaranFormulirDitolak",
          dataPPDB.code_pendaftaran,
          3,
        );
      }

      await pusher.trigger("ppdb", "acc_account", {
        registed_by: dataPPDB.registed_by,
      });

      return response.json({
        status_code: "200",
        message: "Berhasil merubah status formulir",
        data: dataPPDB,
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

module.exports = FormReqController;
