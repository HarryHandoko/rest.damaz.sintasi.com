'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EskullUnit extends Model {
  static get table () {
    return 'tbl_eskul_units'
  }
}

module.exports = EskullUnit
