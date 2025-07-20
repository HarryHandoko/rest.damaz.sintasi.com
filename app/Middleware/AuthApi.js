'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthApi {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {
    try {
      // Check if Authorization header exists (optional: enforce Bearer scheme)
      const authHeader = request.header('Authorization')
      if (!authHeader) {
        return response.status(401).json({
          status: 'error',
          message: 'Authorization header missing'
        })
      }

      // Adonis's auth.check() automatically verifies JWT if using jwt guard
      await auth.check()
      await next()
    } catch (error) {
      return response.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid or expired token',
        error: auth.check()
      })
    }
  }
}

module.exports = AuthApi
