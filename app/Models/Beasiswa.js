'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Beasiswa extends Model {
  static get table() {
    return 'm_beasiswa'
  }
}

module.exports = Beasiswa
