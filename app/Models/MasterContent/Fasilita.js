'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fasilita extends Model {
  static get table () {
    return 'm_fasilitas'
  }
}

module.exports = Fasilita
