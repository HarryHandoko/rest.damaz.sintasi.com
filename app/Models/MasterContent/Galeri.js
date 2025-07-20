'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Galeri extends Model {

  static get table () {
    return 'tbl_galeris'
  }
}

module.exports = Galeri
