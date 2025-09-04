'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Diskon extends Model {
  static get table () {
    return 'm_diskon'
  }
}

module.exports = Diskon
