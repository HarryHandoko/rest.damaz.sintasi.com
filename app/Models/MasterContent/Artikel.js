'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Artikel extends Model {

  static get table () {
    return 'tbl_artikel'
  }
}

module.exports = Artikel
