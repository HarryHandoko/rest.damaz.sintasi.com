'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kota extends Model {
  static get table () {
    return 'indonesia_cities'
  }
}

module.exports = Kota
