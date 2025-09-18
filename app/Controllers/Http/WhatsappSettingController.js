"use strict";
const WhatsappSetting = use("App/Models/WhatsappSetting");

function toWhatsappFormat(text) {
  // Format *text* langsung dipakai untuk WhatsApp
  return text;
}

class WhatsappSettingController {
  async index({ response }) {
    const setting = await WhatsappSetting.first();
    return response.json(setting);
  }

  async store({ request, response }) {
    const data = request.only([
      "api_key",
      "no_handphone",
      "no_handphone_keuangan",
      "format_pesan_registrasi",
      "format_pesan_diterima",
      "format_pesan_ditolak",
      "format_pesan_keuangan",
    ]);
    let setting = await WhatsappSetting.first();

    if (setting) {
      Object.assign(setting, data);
      await setting.save();
    } else {
      setting = await WhatsappSetting.create(data);
    }

    return response.status(201).json({
      message: "Whatsapp settings Berhasil Tersimpan",
      data: setting,
    });
  }
}

module.exports = WhatsappSettingController;
