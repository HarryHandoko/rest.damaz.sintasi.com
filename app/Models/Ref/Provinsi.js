'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provinsi extends Model {
  static get table () {
    return 'indonesia_provinces'
  }
}

module.exports = Provinsi
