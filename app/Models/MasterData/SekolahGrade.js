'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SekolahGrade extends Model {
  static get table () {
    return 'tbl_sekolah_grades'
  }
}

module.exports = SekolahGrade
