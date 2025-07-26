'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RegisterPpdb extends Model {
  static get table () {
    return 'tbl_register_ppdbs'
  }
}

module.exports = RegisterPpdb
