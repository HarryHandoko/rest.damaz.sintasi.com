'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Testimoni extends Model {
  static get table () {
    return 'tbl_testimonis'
  }
}

module.exports = Testimoni
