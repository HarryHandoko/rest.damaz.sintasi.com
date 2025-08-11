'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PrestasiSekolah extends Model {

  static get table () {
    return 'm_prestasi_sekolahs'
  }
}

module.exports = PrestasiSekolah
