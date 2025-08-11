'use strict'
const Sekolah = use('App/Models/MasterData/Sekolah')
const SekolahGrade = use('App/Models/MasterData/SekolahGrade')
const Database = use('Database') // (Adonis 4.x)
const Env = use('Env') // for Adonis 4.x

class SekolahController {
  async index({ request, response }) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const baseUrl = Env.get('BASE_URL')

    // Paginate sekolah
    const data = await Sekolah.query()
      .where('is_delete', '0')
      .orderBy('sort', 'asc')
      .paginate(page, perPage)

    // Convert to plain JSON
    const dataJSON = data.toJSON()

    // Loop & inject grade and logo url
    await Promise.all(
      dataJSON.data.map(async (dataSekolah) => {
        // Ambil grades
        const grades = await SekolahGrade.query()
          .select('tbl_sekolah_grades.*','m_sekolas.name as nama_sekolah')
          .join('m_sekolas','m_sekolas.id','tbl_sekolah_grades.sekolah_id')
          .where('tbl_sekolah_grades.sekolah_id', dataSekolah.id)
          .orderBy('tbl_sekolah_grades.sort','asc')
          .fetch()

        // Tambahkan ke objek utama
        dataSekolah.grade = grades.toJSON()
        dataSekolah.logo = dataSekolah.logo
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.logo}`
          : null
        dataSekolah.foto_kontent_sekolah = dataSekolah.foto_kontent_sekolah
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.foto_kontent_sekolah}`
          : null
        dataSekolah.foto_kontent = dataSekolah.foto_kontent
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.foto_kontent}`
          : null,
        dataSekolah.foto_kepala_unit = dataSekolah.foto_kepala_unit
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.foto_kepala_unit}`
          : null,
        dataSekolah.foto_guru_unit = dataSekolah.foto_guru_unit
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.foto_guru_unit}`
          : null,
        dataSekolah.banner_visi = dataSekolah.banner_visi
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.banner_visi}`
          : null,
        dataSekolah.banner_misi = dataSekolah.banner_misi
          ? `${baseUrl}/uploads/sekolah/${dataSekolah.banner_misi}`
          : null
      })
    )

    return response.json({
      data: dataJSON.data,
      total: dataJSON.total,
      perPage: dataJSON.perPage,
      currentPage: dataJSON.currentPage,
      lastPage: dataJSON.lastPage,
    })
  }


  async store({ request, response }) {
    try {
      // Ambil data dari body request

      const data = request.only(['name','biaya_admin','biaya_pendaftaran','kontent','kontent_detail','slug','code_formulir','moto','visi','misi','sambutan_kepala_unit']);
      data.is_need_nem = request.input('is_need_nem') == 'true' ? 1 : 0;
      data.is_need_test = request.input('is_need_test') == 'true' ? 1 : 0;
      const logo = request.file('logo', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });

      if (logo) {
        const fileName = `${Date.now()}.${logo.extname}`;
        await logo.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.logo = fileName;
      } else {
        return response.status(400).json({ message: 'logo is required' });
      }


      const foto_kontent_sekolah = request.file('foto_kontent_sekolah', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_kontent_sekolah) {
        const fileName = `${Date.now()}.${foto_kontent_sekolah.extname}`;
        await foto_kontent_sekolah.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.foto_kontent_sekolah = fileName;
      } else {
        return response.status(400).json({ message: 'Foto Sekolah is required' });
      }

      const foto_kepala_unit = request.file('foto_kepala_unit', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });

      if (foto_kepala_unit) {
        const fileName = `${Date.now()}.${foto_kepala_unit.extname}`;
        await foto_kepala_unit.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.foto_kepala_unit = fileName;
      } else {
        return response.status(400).json({ message: 'foto_kepala_unit is required' });
      }




      const foto_guru_unit = request.file('foto_guru_unit', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });

      if (foto_guru_unit) {
        const fileName = `${Date.now()}.${foto_guru_unit.extname}`;
        await foto_guru_unit.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.foto_guru_unit = fileName;
      } else {
        return response.status(400).json({ message: 'foto_guru_unit is required' });
      }


      const foto_kontent = request.file('foto_kontent', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_kontent) {
        const fileName = `${Date.now()}.${foto_kontent.extname}`;
        await foto_kontent.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.foto_kontent = fileName;
      } else {
        return response.status(400).json({ message: 'Foto Sekolah is required' });
      }



      const banner_misi = request.file('banner_misi', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (banner_misi) {
        const fileName = `${Date.now()}.${banner_misi.extname}`;
        await banner_misi.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.banner_misi = fileName;
      }

      const banner_visi = request.file('banner_visi', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (banner_visi) {
        const fileName = `${Date.now()}.${banner_visi.extname}`;
        await banner_visi.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        data.banner_visi = fileName;
      }

      // Simpan ke database
      const sekolah = await Sekolah.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'sekolah created successfully',
        data: sekolah,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async delete({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await Sekolah.findOrFail(id)

      data.is_active = 0
      data.is_delete = 1
      data.deleted_by = auth.user.id

      await data.save()
      return response.status(200).json({
        message: 'Data deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting Data',
        error: error.message
      })
    }
  }


  async deleteGrade({ request, response, auth }) {
    try {
      const { id } = request.only(['id'])
      const data = await SekolahGrade.findOrFail(id)
      await data.delete()
      return response.status(200).json({
        message: 'Data deleted successfully'
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting Data',
        error: error.message
      })
    }
  }



  async storeGrade({ request, response }) {
    try {
      const data = request.only(['name','sekolah_id']);
      const getSort = await SekolahGrade.query().where('sekolah_id',request.input('sekolah_id')).orderBy('sort','desc').first();
      data.sort = getSort != null ? parseInt(getSort.sort) + 1 : 0 ;
      const grade = await SekolahGrade.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: grade,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async updateGrade({ request, response }) {
    try {
      const data = request.only(['name']);
      const grade = await SekolahGrade.findOrFail(request.input('id'))

      grade.name = request.input('name')
      grade.save()

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: grade,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }



  async update({ request, response }) {
    try {
      const data = request.only(['name','biaya_admin','biaya_pendaftaran']);
      const sekolah = await Sekolah.findOrFail(request.input('id'))

      sekolah.name = request.input('name')
      sekolah.biaya_admin = request.input('biaya_admin')
      sekolah.code_formulir = request.input('code_formulir')
      sekolah.biaya_pendaftaran = request.input('biaya_pendaftaran')
      sekolah.kontent = request.input('kontent')
      sekolah.kontent_detail = request.input('kontent_detail')
      sekolah.sambutan_kepala_unit = request.input('sambutan_kepala_unit')
      sekolah.moto = request.input('moto')
      sekolah.visi = request.input('visi')
      sekolah.misi = request.input('misi')
      sekolah.slug = request.input('slug')
      sekolah.is_need_nem = request.input('is_need_nem') == 'true' ? 1 : 0;
      sekolah.is_need_test = request.input('is_need_test') == 'true' ? 1 : 0;


      const logo = request.file('logo', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (logo) {
        const fileName = `${Date.now()}.${logo.extname}`;
        await logo.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.logo = fileName;
      }


      const banner_misi = request.file('banner_misi', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (banner_misi) {
        const fileName = `${Date.now()}.${banner_misi.extname}`;
        await banner_misi.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.banner_misi = fileName;
      }

      const banner_visi = request.file('banner_visi', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (banner_visi) {
        const fileName = `${Date.now()}.${banner_visi.extname}`;
        await banner_visi.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.banner_visi = fileName;
      }

      const foto_kepala_unit = request.file('foto_kepala_unit', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_kepala_unit) {
        const fileName = `${Date.now()}.${foto_kepala_unit.extname}`;
        await foto_kepala_unit.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.foto_kepala_unit = fileName;
      }


      const foto_guru_unit = request.file('foto_guru_unit', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_guru_unit) {
        const fileName = `${Date.now()}.${foto_guru_unit.extname}`;
        await foto_guru_unit.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.foto_guru_unit = fileName;
      }


      const foto_kontent_sekolah = request.file('foto_kontent_sekolah', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_kontent_sekolah) {
        const fileName = `${Date.now()}.${foto_kontent_sekolah.extname}`;
        await foto_kontent_sekolah.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.foto_kontent_sekolah = fileName;
      }



      const foto_kontent = request.file('foto_kontent', {
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      });
      if (foto_kontent) {
        const fileName = `${Date.now()}.${foto_kontent.extname}`;
        await foto_kontent.move('public/uploads/sekolah', {
          name: fileName,
          overwrite: true
        });
        sekolah.foto_kontent = fileName;
      }


      sekolah.save()

      return response.status(201).json({
        status: 'success',
        message: 'Grade created successfully',
        data: sekolah,
      })
    } catch (error) {
      return response.status(500).json({ status: 'error', message: 'Server error' , data : error.message})
    }
  }


  async indexSelect({ request, response }) {
    const data = await Sekolah.query()
      .where('is_delete', '0').fetch()
    return response.json({
      data: data,
    })
  }



  async indexSelectGrade({ request, response }) {
    const data = await SekolahGrade.query()
      .where('sekolah_id', request.input('sekolah_id')).fetch()
    return response.json({
      data: data,
    })
  }

  async updateSortGrade({ request, response}){
    try {
        const { id, type } = request.only(['id', 'type'])
        const dataGrade = await SekolahGrade.findOrFail(id)

        let GradeUpSort
        if (type === 'up') {
          // dataGrade dengan sort lebih kecil (di atas)
          GradeUpSort = await SekolahGrade.query()
            .where('sekolah_id', dataGrade.sekolah_id)
            .where('sort', '<', dataGrade.sort)
            .orderBy('sort', 'desc') // Ambil yang paling dekat ke atas
            .first()
        } else if (type === 'down') {
          // dataGrade dengan sort lebih besar (di bawah)
          GradeUpSort = await SekolahGrade.query()
            .where('sekolah_id', dataGrade.sekolah_id)
            .where('sort', '>', dataGrade.sort)
            .orderBy('sort', 'asc') // Ambil yang paling dekat ke bawah
            .first()
        }

        if (!GradeUpSort) {
          return response.status(400).json({
            message: 'Tidak bisa dipindahkan',
          })
        }

        // Tukar nilai sort
        const tempSort = dataGrade.sort
        dataGrade.sort = GradeUpSort.sort
        GradeUpSort.sort = tempSort

        await dataGrade.save()
        await GradeUpSort.save()

        return response.status(200).json({
          message: 'Data updated successfully',
          data: dataGrade
        })
      } catch (error) {
        return response.status(500).json({
          message: 'Error updating Data',
          error: error.message
        })
      }
  }




  async updateSort({ request, response}){
    try {
        const { id, type } = request.only(['id', 'type'])
        const dataSekolah = await Sekolah.findOrFail(id)

        let GradeUpSort
        if (type === 'up') {
          // dataSekolah dengan sort lebih kecil (di atas)
          GradeUpSort = await Sekolah.query()
            .where('sort', '<', dataSekolah.sort)
            .orderBy('sort', 'desc') // Ambil yang paling dekat ke atas
            .first()
        } else if (type === 'down') {
          // dataSekolah dengan sort lebih besar (di bawah)
          GradeUpSort = await Sekolah.query()
            .where('sort', '>', dataSekolah.sort)
            .orderBy('sort', 'asc') // Ambil yang paling dekat ke bawah
            .first()
        }

        if (!GradeUpSort) {
          return response.status(400).json({
            message: 'Tidak bisa dipindahkan',
          })
        }

        // Tukar nilai sort
        const tempSort = dataSekolah.sort
        dataSekolah.sort = GradeUpSort.sort
        GradeUpSort.sort = tempSort

        await dataSekolah.save()
        await GradeUpSort.save()

        return response.status(200).json({
          message: 'Data updated successfully',
          data: dataSekolah
        })
      } catch (error) {
        return response.status(500).json({
          message: 'Error updating Data',
          error: error.message
        })
      }
  }
}

module.exports = SekolahController
