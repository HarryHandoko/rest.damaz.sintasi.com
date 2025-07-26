'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kelurahan extends Model {
  static get table () {
    return 'indonesia_districts'
  }
}

module.exports = Kelurahan
