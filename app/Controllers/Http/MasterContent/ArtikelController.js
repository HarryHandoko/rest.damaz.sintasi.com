'use strict'

const Artikel = use('App/Models/MasterContent/Artikel')
const User = use('App/Models/User')
const Tag = use('App/Models/MasterContent/Tag')
const Database = use('Database') // (Adonis 4.x)
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
const Env = use('Env') // for Adonis 4.x

const formatDate = (date) => {
  if (!date) return null
  // Pastikan date bertipe Date, jika bukan, parse dulu
  const d = new Date(date)
  // Hasilnya string "YYYY-MM-DD"
  return d.toISOString().slice(0, 10)
}

class ArtikelController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search', '')
    const baseUrl = Env.get('BASE_URL')

    const dataQuery = Artikel.query()

    if (search) {
      dataQuery.where('title', 'like', `%${search}%`)
    }

    const data = await dataQuery.paginate(page, 9999)
    const result = data.toJSON()

    // Add image URL and tags to each article
    for (const artikel of result.data) {
      artikel.image = artikel.image
        ? `${baseUrl}/uploads/artikel/${artikel.image}`
        : null

      artikel.scheduled_at = formatDate(artikel.scheduled_at);
      const Creator =  await User.find(artikel.user_id);
      artikel.creator = Creator.nama_depan + ' ' + Creator.nama_belakang;

      // Query tags for this article from tbl_artikel_tag
      const tags = await Database
        .from('tbl_artikel_tags')
        .where('article_id', artikel.id)

      // Map tags to array of tag_name (adjust column name if different)
      artikel.tags = tags.map(tag => tag.tag_id)
    }

    return response.json(result)
  }


  async indexTag({ response }) {
    const data = await Tag.query().fetch()

    return response.status(200).json({
      data: data
    })
  }

 async store({ request, response, auth }) {
    const trx = await Database.beginTransaction();

    try {
      const data = request.only(['title', 'content', 'status', 'scheduled_at']);

      let tags = request.input('tags', '[]');
      try { tags = JSON.parse(tags); } catch { tags = []; }

      data.slug = slugify(data.title);

      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '5mb'
      });

      if (image) {
        const fileName = `${Date.now()}.${image.extname}`;
        await image.move('public/uploads/artikel', {
          name: fileName,
          overwrite: true
        });
        data.image = fileName;
      } else {
        await trx.rollback();
        return response.status(400).json({ message: 'Image is required' });
      }

      data.user_id = auth.user.id;
      if(data.status == 'published'){
        const datenow = new Date();
        data.scheduled_at = datenow
        data.scheduled_at = datenow
      }

      // Insert artikel (pakai Query Builder)
      const [artikelId] = await Database.table('tbl_artikel').transacting(trx).insert(data).returning('id');
      const artikel = await Database.from('tbl_artikel').where('id', artikelId).first();

      // Insert tags (jika ada)
      if (tags.length > 0) {
        const artikelTags = tags.map(tag => ({
          article_id: artikelId,
          tag_id: tag
        }));
        await Database.table('tbl_artikel_tags').transacting(trx).insert(artikelTags);
      }

      await trx.commit();

      return response.status(201).json({
        message: 'Artikel berhasil dibuat',
        data: artikel
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: 'Gagal membuat Artikel',
        error: error.message
      });
    }
  }



  async AddingTag({ request, response }) {
    try {
      const data = request.only(['name'])
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const tag = await Tag.create(data)

      return response.status(201).json({
        message: 'Galeri berhasil Tag',
        data: tag
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Gagal membuat Tag',
        error: error.message
      })
    }
  }


  async delete({ request, response }) {
    const trx = await Database.beginTransaction();

    try {
      // Ambil ID artikel dari request (bisa dari params, body, atau query)
      const artikelId = request.input('id');
      if (!artikelId) {
        await trx.rollback();
        return response.status(400).json({
          message: 'Artikel ID is required'
        });
      }

      // Hapus semua tag relasi dulu
      await Database.table('tbl_artikel_tags')
        .where('article_id', artikelId)
        .transacting(trx)
        .delete();

      // Hapus artikelnya
      const deleted = await Database.table('tbl_artikel')
        .where('id', artikelId)
        .transacting(trx)
        .delete();

      if (!deleted) {
        await trx.rollback();
        return response.status(404).json({
          message: 'Artikel tidak ditemukan'
        });
      }

      await trx.commit();

      return response.status(200).json({
        message: 'Artikel & relasi tags berhasil dihapus'
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: 'Error deleting artikel',
        error: error.message
      });
    }
  }



  async update({ request, response, params, auth }) {
    const trx = await Database.beginTransaction();

    try {
      const data = request.only(['id','title', 'content', 'status', 'scheduled_at']);
      const artikelId = request.input('id');


      let tags = request.input('tags', '[]');
      try { tags = JSON.parse(tags); } catch { tags = []; }

      if (data.title) data.slug = slugify(data.title);

      const image = request.file('image', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '5mb'
      });

      if (image) {
        const fileName = `${Date.now()}.${image.extname}`;
        await image.move('public/uploads/artikel', {
          name: fileName,
          overwrite: true
        });
        data.image = fileName;
      }

      data.user_id = auth.user.id;

      // Update artikel (Query Builder)
      await Database.table('tbl_artikel').transacting(trx).where('id', artikelId).update(data);

      // Update tags:
      // 1. Delete old tags
      await Database.table('tbl_artikel_tags').transacting(trx).where('article_id', artikelId).delete();

      // 2. Insert new tags (if any)
      if (tags.length > 0) {
        const artikelTags = tags.map(tag => ({
          article_id: artikelId,
          tag_id: tag
        }));
        await Database.table('tbl_artikel_tags').transacting(trx).insert(artikelTags);
      }

      // Get updated artikel
      const artikel = await Database.from('tbl_artikel').where('id', artikelId).first();

      await trx.commit();

      return response.json({
        message: 'Artikel berhasil diupdate',
        data: artikel
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: 'Gagal update Artikel',
        error: error.message
      });
    }
  }


}

module.exports = ArtikelController
