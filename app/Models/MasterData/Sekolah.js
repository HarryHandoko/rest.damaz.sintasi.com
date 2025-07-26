'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sekolah extends Model {
  static get table () {
    return 'm_sekolas'
  }
}

module.exports = Sekolah
