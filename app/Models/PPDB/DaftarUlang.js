'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DaftarUlang extends Model {
  static get table () {
    return 'tbl_daftar_ulangs'
  }
}

module.exports = DaftarUlang
