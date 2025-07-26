'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Desa extends Model {
  static get table () {
    return 'indonesia_villages'
  }
}

module.exports = Desa
