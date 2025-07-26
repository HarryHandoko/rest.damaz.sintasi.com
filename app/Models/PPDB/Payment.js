'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Payment extends Model {
  static get table () {
    return 'tbl_register_ppdb_payments'
  }
}

module.exports = Payment
