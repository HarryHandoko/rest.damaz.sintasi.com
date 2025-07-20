'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {

  static get table () {
    return 'tbl_tag'
  }
}

module.exports = Tag
