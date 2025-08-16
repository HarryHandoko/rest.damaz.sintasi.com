'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BackgroundPrestasi extends Model {

  static get table () {
    return 'm_background_prestasi_units'
  }
}

module.exports = BackgroundPrestasi
