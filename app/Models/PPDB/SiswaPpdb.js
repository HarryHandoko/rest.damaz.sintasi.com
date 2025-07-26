'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SiswaPpdb extends Model {
  static get table () {
    return 'tbl_register_ppdb_siswas'
  }
}

module.exports = SiswaPpdb
