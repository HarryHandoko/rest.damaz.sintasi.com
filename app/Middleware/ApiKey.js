'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ApiKey {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
   async handle({ request, response }, next) {   // <-- ADA response di sini!
    const apikey = request.header('x-api-key')
    const validApiKey = 'YEHTtRk0CK3meHvnWWwhzbbG1UVbflUh'
    if (apikey !== validApiKey) {
      return response.status(401).json({ message: 'Invalid API Key' })
    }
    await next()
  }
}

module.exports = ApiKey
