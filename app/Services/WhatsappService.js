'use strict'

const axios = require('axios')
const WhatsappSetting = use('App/Models/WhatsappSetting')

class WhatsappService {
  constructor() {
    this.baseUrl = 'https://wabot.sintasi.com'
  }

  async getSetting() {
    if (!this.whatsappSetting) {
      this.whatsappSetting = await WhatsappSetting.query().first()
    }
    return this.whatsappSetting
  }

  async getDevices() {
    const setting = await this.getSetting()
    try {
      const response = await axios.get(`${this.baseUrl}/api/devices`, {
        headers: {
          'secret-key': setting.api_key,
        },
      })
      const devices = response.data?.devices || []
      if (!devices.length) {
        throw new Error('No devices found')
      }
      return devices
    } catch (error) {
      console.log(error)
      throw new Error(`Failed to get devices: ${error.message}`)
    }
  }

  async getDeviceIdByPhoneNumber(phoneNumber) {
    const devices = await this.getDevices()
    const device = devices.find((d) => String(d.phone) === String(phoneNumber))
    if (!device) {
      throw new Error('Phone number not found in devices')
    }
    return device._id
  }

  async sendMessage(message, phoneNumber) {
    const setting = await this.getSetting()
    try {
      const id = await this.getDeviceIdByPhoneNumber(setting.phone_number)
      const response = await axios.post(
        `${this.baseUrl}/api/devices/${id}/send/${phoneNumber}`,
        { message },
        { headers: { 'secret-key': setting.api_key } }
      )
      return response.data
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`)
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
_Panitia PSB Darul Quran Mulia_`
  }
}

module.exports = new WhatsappService()
