"use strict";
const WhatsappSetting = use("App/Models/WhatsappSetting");

class WhatsappSettingController {
  async index({ response }) {
    const setting = await WhatsappSetting.first();
    return response.json(setting);
  }

  async store({ request, response }) {
    const data = request.only(["api_key", "phone_number"]);
    let setting = await WhatsappSetting.first();

    if (setting) {
      setting.api_key = data.api_key;
      setting.phone_number = data.phone_number;
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
