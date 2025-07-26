'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SiswaAward extends Model {
  static get table () {
    return 'tbl_register_ppdb_siswa_prestasis'
  }
}

module.exports = SiswaAward
