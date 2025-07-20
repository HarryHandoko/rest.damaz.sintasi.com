'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class WebProfile extends Model {
  static get table () {
    return 'tbl_web_profiles'
  }
}

module.exports = WebProfile
