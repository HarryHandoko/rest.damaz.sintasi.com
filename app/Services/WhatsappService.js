"use strict";

const axios = require("axios");
const WhatsappSetting = use("App/Models/WhatsappSetting");
const RegisterPPDB = use("App/Models/PPDB/RegisterPpdb");
const SiswaPPDB = use("App/Models/PPDB/SiswaPpdb");
const Sekolah = use("App/Models/MasterData/Sekolah");
const SekolahGrade = use("App/Models/MasterData/SekolahGrade");
const RegParent = use("App/Models/PPDB/RegParent");
const moment = require("moment");

class WhatsappService {
  constructor() {
    this.baseUrl = "https://wabot.sintasi.com";
  }

  async getSetting() {
    if (!this.whatsappSetting) {
      this.whatsappSetting = await WhatsappSetting.query().first();
    }
    return this.whatsappSetting;
  }

  async getDevices() {
    const setting = await this.getSetting();
    try {
      const response = await axios.get(`${this.baseUrl}/api/devices`, {
        headers: {
          "secret-key": setting.api_key,
        },
      });
      const devices = response.data?.devices || [];
      if (!devices.length) {
        throw new Error("No devices found");
      }
      return devices;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to get devices: ${error.message}`);
    }
  }

  async getDeviceIdByPhoneNumber(phoneNumber) {
    const devices = await this.getDevices();
    const device = devices.find((d) => String(d.phone) === String(phoneNumber));
    if (!device) {
      throw new Error("Phone number not found in devices");
    }
    return device._id;
  }

  async sendMessage(message, phoneNumber) {
    const setting = await this.getSetting();
    try {
      const id = await this.getDeviceIdByPhoneNumber(setting.no_handphone);
      const response = await axios.post(
        `${this.baseUrl}/api/devices/${id}/send/${phoneNumber}`,
        { message },
        { headers: { "secret-key": setting.api_key } }
      );

      return response.data;
    } catch (error) {
      console.log(error)
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Fungsi untuk mengganti placeholder di template dengan data
  replacePlaceholders(template, data) {
    let result = template;
    Object.keys(data).forEach((key) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), data[key]);
    });
    return result;
  }

  async getData(kodePendaftaran) {
    const ppdb = await RegisterPPDB.query()
      .where("code_pendaftaran", kodePendaftaran)
      .first();

    const siswa = await SiswaPPDB.query().where("id", ppdb.siswa_id).first();
    const sekolah = await Sekolah.query().where("id", ppdb.sekolah_id).first();
    const grade = await SekolahGrade.query().where("id", ppdb.grade_id).first();

    const orangTua = await RegParent.query()
      .where("register_id", ppdb.id)
      .first();

    let noHpOrtu = null;
    if (orangTua) {
      noHpOrtu =
        orangTua.no_telepon_ibu && orangTua.no_telepon_ibu !== "-"
          ? orangTua.no_telepon_ibu
          : orangTua.no_telepon_ayah && orangTua.no_telepon_ayah !== "-"
          ? orangTua.no_telepon_ayah
          : orangTua.no_telepon_wali && orangTua.no_telepon_wali !== "-"
          ? orangTua.no_telepon_wali
          : null;
    }

    return {
      nama: `${siswa.nama_depan} ${siswa.nama_belakang}`,
      sekolah: sekolah.name,
      jenjang: grade.name,
      jenis_kelamin: siswa.jenis_kelamin,
      kode_pendaftaran: ppdb.code_pendaftaran,
      no_hp_ortu: noHpOrtu,
    };
  }

  async sendRegisterMessage(kodePendaftaran) {
    const setting = await this.getSetting();
    let template = setting.format_pesan_registrasi;
    if (!template) throw new Error("Template pesan registrasi belum disetting");
    const data = await this.getData(kodePendaftaran);
    const message = this.replacePlaceholders(template, data);
    return await this.sendMessage(message, data.no_hp_ortu);
  }

  /**
   * @param {string} phoneNumber
   * @param {{ nama: string, jenjang: string, kategori: string, jenis_kelamin: string }} data
   */
  async sendApprovalMessage(kodePendaftaran) {
    const setting = await this.getSetting();
    let template = setting.format_pesan_diterima;
    if (!template) throw new Error("Template pesan diterima belum disetting");
    const data = await this.getData(kodePendaftaran);
    const message = this.replacePlaceholders(template, data);
    return await this.sendMessage(message, data.no_hp_ortu);
  }

  /**
   * @param {string} phoneNumber
   * @param {{ nama: string, jenjang: string, kategori: string, jenis_kelamin: string }} data
   */
  async sendRejectedMessage(kodePendaftaran) {
    const setting = await this.getSetting();
    let template = setting.format_pesan_ditolak;
    if (!template) throw new Error("Template pesan ditolak belum disetting");
    const data = await this.getData(kodePendaftaran);
    const message = this.replacePlaceholders(template, data);
    return await this.sendMessage(message, data.no_hp_ortu);
  }
}

module.exports = new WhatsappService();
