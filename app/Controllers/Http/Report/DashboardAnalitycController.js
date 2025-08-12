'use strict'

const RegisterPPDB = use('App/Models/PPDB/RegisterPpdb')
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
      .groupBy('year')
      .orderBy('year', 'asc')

    // Buat array tahun lengkap dari startYear sampai currentYear
    const years = []
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y)
    }

    // Merge queryData ke years, isi total = 0 jika tidak ada data
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

}

module.exports = DashboardAnalitycController
