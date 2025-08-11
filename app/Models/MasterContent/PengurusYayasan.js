'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PengurusYayasan extends Model {

  static get table () {
    return 'm_pengurus_yayasans'
  }
}

module.exports = PengurusYayasan
