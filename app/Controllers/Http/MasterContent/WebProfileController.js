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
        : null,
      logo: data.logo
        ? `${baseUrl}/uploads/web_profile/${data.logo}`
        : null,
      banner_about: data.banner_about
        ? `${baseUrl}/uploads/web_profile/${data.banner_about}`
        : null,
      banner_visi: data.banner_visi
        ? `${baseUrl}/uploads/web_profile/${data.banner_visi}`
        : null,
      banner_misi: data.banner_misi
        ? `${baseUrl}/uploads/web_profile/${data.banner_misi}`
        : null,
      banner_sambutan: data.banner_sambutan
        ? `${baseUrl}/uploads/web_profile/${data.banner_sambutan}`
        : null,
      brosur: data.brosur
        ? `${baseUrl}/uploads/web_profile/${data.brosur}`
        : null
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
      'social_fb', 'social_ig', 'social_youtube', 'social_wa','komitmen_kami','tentang_kami','visi','misi',
      'link_youtube','sambutan','founder'
    ])

    // Upload file ... (copy dari kode kamu sebelumnya)
    // ---- Sambutan ----
    const bannerSambutanFile = request.file('banner_sambutan', {
      types: ['image'],
      size: '10mb'
    })
    if (bannerSambutanFile) {
      const fileName = `banner_sambutan_${Date.now()}.${bannerSambutanFile.subtype}`
      await bannerSambutanFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!bannerSambutanFile.moved()) {
        return response.status(400).json({ error: bannerSambutanFile.error() })
      }
      input.banner_sambutan = fileName
    }
    // ---- bannerAbout ----
    const bannerAboutFile = request.file('banner_about', {
      types: ['image'],
      size: '10mb'
    })
    if (bannerAboutFile) {
      const fileName = `banner_about_${Date.now()}.${bannerAboutFile.subtype}`
      await bannerAboutFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!bannerAboutFile.moved()) {
        return response.status(400).json({ error: bannerAboutFile.error() })
      }
      input.banner_about = fileName
    }
    // ---- bannerVisi ----
    const bannerVisiFile = request.file('banner_visi', {
      types: ['image'],
      size: '10mb'
    })
    if (bannerVisiFile) {
      const fileName = `banner_visi_${Date.now()}.${bannerVisiFile.subtype}`
      await bannerVisiFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!bannerVisiFile.moved()) {
        return response.status(400).json({ error: bannerVisiFile.error() })
      }
      input.banner_visi = fileName
    }

    // ---- bannerMisi ----
    const bannerMisiFile = request.file('banner_misi', {
      types: ['image'],
      size: '10mb'
    })
    if (bannerMisiFile) {
      const fileName = `banner_misi_${Date.now()}.${bannerMisiFile.subtype}`
      await bannerMisiFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })
      if (!bannerMisiFile.moved()) {
        return response.status(400).json({ error: bannerMisiFile.error() })
      }
      input.banner_misi = fileName
    }
    // ---- banner ----
    const bannerFile = request.file('banner', {
      types: ['image'],
      size: '10mb'
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
      size: '10mb'
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



    const brosurFile = request.file('brosur', {
      types: ['pdf'],
      size: '10mb'
    })

    if (brosurFile) {
      const fileName = `brosur_${Date.now()}.${brosurFile.subtype}`

      await brosurFile.move(Helpers.publicPath('uploads/web_profile'), {
        name: fileName,
        overwrite: true
      })

      if (!brosurFile.moved()) {
        return response.status(400).json({
          success: false,
          message: 'Gagal memindahkan file brosur.',
          error: brosurFile.error()
        })
      }

      // Simpan nama file ke input atau model
      input.brosur = fileName
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
