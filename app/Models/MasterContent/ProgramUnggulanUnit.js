'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProgramUnggulanUnit extends Model {

  static get table () {
    return 'm_program_unggulan_sekolahs'
  }
}

module.exports = ProgramUnggulanUnit
