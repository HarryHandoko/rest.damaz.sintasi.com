'use strict'

const WebProfile = use('App/Models/MasterContent/WebProfile')
const Helpers = use('Helpers')
const fs = use('fs')

class WebProfileController {
  // GET: Tampilkan profil
  async show({ response, request }) {
    const Env = use('Env')
    const baseUrl = Env.get('BASE_URL') // contoh: http://localhost:3333

    const data = await WebProfile.first()
    if (!data) return response.json({})

    // Masking response
    const result = {
      ...data.toJSON(),
      banner: data.banner
        ? `${baseUrl}/uploads/web_profile/${data.banner}`
        : `${baseUrl}/default/banner.png`,
      logo: data.logo
        ? `${baseUrl}/uploads/web_profile/${data.logo}`
        : `${baseUrl}/default/logo.png`
    }
    return response.json(result)
  }


  async update({ request, response }) {
   try {
     const Helpers = use('Helpers')
    const fs = use('fs')

    let profile = await WebProfile.first()
    const input = request.only([
      'title', 'address', 'whatsapp', 'email',
      'social_fb', 'social_ig', 'social_youtube', 'social_wa'
    ])

    // Upload file ... (copy dari kode kamu sebelumnya)
    // ---- banner ----
    const bannerFile = request.file('banner', {
      types: ['image'],
      size: '2mb'
    })
    if (bannerFile) {
      const fileName = `banner_${Date.now()}.${bannerFile.subtype}`
      await bannerFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!bannerFile.moved()) {
        return response.status(400).json({ error: bannerFile.error() })
      }
      input.banner = fileName
    }

    // ---- logo ----
    const logoFile = request.file('logo', {
      types: ['image'],
      size: '2mb'
    })
    if (logoFile) {
      const fileName = `logo_${Date.now()}.${logoFile.subtype}`
      await logoFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!logoFile.moved()) {
        return response.status(400).json({ error: logoFile.error() })
      }
      input.logo = fileName
    }

    // --- SIMPAN DATA ---
    if (!profile) {
      // Jika belum ada, buat baru
      profile = await WebProfile.create(input)
    } else {
      // Jika sudah ada, update data
      profile.merge(input)
      await profile.save()
    }

    return response.json({ message: 'Profil berhasil diupdate', data: profile })
   } catch (error) {

      return response.status(500).json({ status: error, message: 'Server error' })
   }
  }

}

module.exports = WebProfileController
