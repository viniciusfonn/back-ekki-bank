'use strict'

const Account = use('App/Models/Account')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with account
 */
class AccountController {
  /**
   * Show a list of all account.
   * GET account
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ }) {
    const accounts = await Account.query()
      .with('user')
      .orderBy('created_at', 'desc')
      .fetch()

    return accounts

  }



  /**
   * Create/save a new account.
   * POST account
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, response }) {
    const userHasAccount = await Account.findBy('user_id', auth.user.id)
    if (userHasAccount) {
      return response
        .status(401)
        .send({ error: { message: 'Usuário já possui conta' } })
    }

    const data = {
      amount: 1000,
      limit: 500,
    }

    const account = await Account.create({ ...data, user_id: auth.user.id })

    return account
  }

  /**
   * Display a single account.
   * GET account/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params,response, auth }) {

    const account = await Account.findOrFail(params.id)

    if (account.user_id !== auth.user.id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    await account.load('user')

    return account
  }



  /**
   * Update account details.
   * PUT or PATCH account/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, response, request, auth }) {
    const account = await Account.findOrFail(params.id)

    if (auth.user.id !== account.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    const data = await request.only(['limit'])

    account.merge(data)
    await account.save()

    return account

  }

  /**
   * Delete a account with id.
   * DELETE account/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    const account = await Account.find(params.id)

    if (auth.user.id !== account.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    await account.delete()
  }
}

module.exports = AccountController

