'use strict'

const RegisterPPDB = use('App/Models/PPDB/RegisterPpdb')
const Sekolah = use('App/Models/MasterData/Sekolah')
const Database = use('Database')

class DashboardAnalitycController {
  async totalPertahun({ response }) {
    try {
      const currentYear = new Date().getFullYear()
      const startYear = currentYear - 4 // 5 tahun terakhir

      // Query total per tahun yang ada datanya
      const queryData = await RegisterPPDB
        .query()
        .select(Database.raw('YEAR(tanggal_pendaftaran) as year'))
        .count('* as total')
        .whereRaw('YEAR(tanggal_pendaftaran) BETWEEN ? AND ?', [startYear, currentYear])
        .where('is_submit','1')
        .groupBy('year')
        .orderBy('year', 'asc')

      const years = []
      for (let y = startYear; y <= currentYear; y++) {
        years.push(y)
      }

      const result = years.map(year => {
        const found = queryData.find(d => d.year === year)
        return {
          year,
          total: found ? Number(found.total) : 0
        }
      })

      return response.json(result)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }


  async totalUnitPertahun({ request,response }) {
    try {

      const tahun = request.input('tahun', null)
      let dataUnit = await Sekolah.query().where('is_active', '1').fetch();
      dataUnit = dataUnit.toJSON();

      await Promise.all(dataUnit.map(async (item, index) => {
        let query = RegisterPPDB.query()
          .where('is_submit', '1')
          .where('sekolah_id',item.id)

        if (tahun) {
          query = query.whereRaw('YEAR(tanggal_pendaftaran) = ?', [tahun])
        }

        const total = await query.count('* as total')

        dataUnit[index].unit = item.name;
        dataUnit[index].total = Number(total[0].total);
      }))

      return response.status(200).json({
         data : dataUnit
      })

    } catch (error) {
      return response.status(500).json({
         message: 'Internal Server Error' ,
         error : error.message
      })
    }
  }


  async totalPerGender({ request,response }) {
    try {
      const tahun = request.input('tahun', null)

      let baseQuery = RegisterPPDB.query()
        .join('tbl_register_ppdb_siswas', 'tbl_register_ppdb_siswas.id', 'tbl_register_ppdbs.siswa_id')
        .where('tbl_register_ppdbs.is_submit', '1')

      if (tahun) {
        baseQuery = baseQuery.whereRaw('YEAR(tbl_register_ppdbs.tanggal_pendaftaran) = ?', [tahun])
      }

      // Clone query untuk laki-laki dan perempuan
      const dataLakiLaki = baseQuery.clone().where('tbl_register_ppdb_siswas.jenis_kelamin', 'Laki-laki')
      const dataPerempuan = baseQuery.clone().where('tbl_register_ppdb_siswas.jenis_kelamin', 'Perempuan')

      const LakiLaki = await dataLakiLaki.count('* as total')
      const Perempuan = await dataPerempuan.count('* as total')

      return response.status(200).json({
        data: [
          {
            label: 'Laki-laki',
            value: Number(LakiLaki[0].total),
          },
          {
            label: 'Perempuan',
            value: Number(Perempuan[0].total),
          },
        ],
      })


    } catch (error) {
      return response.status(500).json({
         message: 'Internal Server Error' ,
         error : error.message
      })
    }
  }

}

module.exports = DashboardAnalitycController
