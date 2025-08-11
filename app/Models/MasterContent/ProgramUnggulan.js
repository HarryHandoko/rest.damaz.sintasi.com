'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProgramUnggulan extends Model {

  static get table () {
    return 'm_program_unggulans'
  }
}

module.exports = ProgramUnggulan
