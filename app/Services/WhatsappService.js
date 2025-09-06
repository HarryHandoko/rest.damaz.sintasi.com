"use strict";

const axios = require("axios");
const WhatsappSetting = use("App/Models/WhatsappSetting");
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
      const id = await this.getDeviceIdByPhoneNumber(setting.phone_number);
      const response = await axios.post(
        `${this.baseUrl}/api/devices/${id}/send/${phoneNumber}`,
        { message },
        { headers: { "secret-key": setting.api_key } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  formatRegisterMessage({ namaLengkap, jenisKelamin, jenjang, kategori }) {
    return `*Assalamu'alaikum warahmatullahi wabarakatuh*

Alhamdulillah, pendaftaran *PSB Darul Quran Mulia* atas nama:

👤 *Nama:* ${namaLengkap}
👫 *Jenis Kelamin:* ${jenisKelamin}
🏫 *Jenjang:* ${jenjang}
📚 *Kategori:* ${kategori}

telah berhasil kami terima. Terima kasih atas kepercayaannya kepada Darul Quran Mulia sebagai pilihan pendidikan untuk ananda.

Selanjutnya, silakan menunggu informasi lanjutan dari panitia PSB.
Apabila ada pertanyaan, jangan ragu menghubungi kami melalui nomor resmi Darul Quran Mulia:

📞 *CS Putri:* 0812-8882-9847
📞 *CS Putra:* 0851-7307-7975

Barakallahu fiikum.

*Wassalamu'alaikum warahmatullahi wabarakatuh*
_Panitia PSB Darul Quran Mulia_`;
  }

  formatApprovalMessage({
    user,
    dataSiswa,
    dataSekolah,
    dataSekolahGrade,
    data,
    dataSiswaAddress,
  }) {
    return `*Halo ${user.nama_depan},*

Pendaftaran siswa berikut telah *DISETUJUI*:

👤 *Nama Siswa:* ${dataSiswa.nama_depan + " " + (dataSiswa.nama_belakang || "")}
🏫 *Sekolah:* ${dataSekolah.name || "-"}
📚 *Jenjang:* ${dataSekolahGrade.name || "-"}
🔑 *Kode Pendaftaran:* ${data.code_pendaftaran}
🎂 *Tempat, Tanggal Lahir:* ${dataSiswa.tempat_lahir || "-"}, ${moment(
      dataSiswa.tgl_lahir
    )
      .locale("id")
      .format("D MMMM YYYY")}
🏠 *Alamat:* ${dataSiswaAddress.alamat || "-"}

Silakan lanjutkan proses berikutnya melalui portal PPDB kami.

Salam,
*Tim PPDB SDIT Darul Maza*`;
  }

  formatRejectedMessage({
    user,
    fullName,
    dataSekolah,
    dataSekolahGrade,
    data,
    dataSiswa,
    dataSiswaAddress,
  }) {
    return `*Halo ${user.nama_depan},*

Mohon maaf, pendaftaran siswa berikut telah *DITOLAK*:

👤 *Nama Siswa:* ${fullName.trim() || "-"}
🏫 *Sekolah:* ${dataSekolah?.name || "-"}
📚 *Jenjang:* ${dataSekolahGrade?.name || "-"}
🔑 *Kode Pendaftaran:* ${data.code_pendaftaran}
🎂 *Tempat, Tanggal Lahir:* ${dataSiswa.tempat_lahir || "-"}, ${moment(
      dataSiswa.tgl_lahir
    )
      .locale("id")
      .format("D MMMM YYYY")}
🏠 *Alamat:* ${dataSiswaAddress?.alamat || "-"}

Silakan hubungi tim kami melalui portal PPDB jika Anda membutuhkan klarifikasi lebih lanjut.

Salam,
*Tim PPDB SDIT Darul Maza*`;
  }
}

module.exports = new WhatsappService();
