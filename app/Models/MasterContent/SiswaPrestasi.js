'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SiswaPrestasi extends Model {

  static get table () {
    return 'm_siswa_berprestasis'
  }
}

module.exports = SiswaPrestasi
