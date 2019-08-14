'use strict'
const Transaction = use('App/Models/Transaction')
const Account = use('App/Models/Account')

const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with transaction
 */
class TransactionController {
  /**
   * Show a list of all transaction.
   * GET transaction
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, auth }) {

    const transactions = await Transaction.query()
      .where('account_owner_id', '=', params.accounts_id)
      .orWhere('account_receiver_id', '=', params.accounts_id)
      .fetch()

   

    return transactions
  }



  /**
   * Create/save a new transaction.
   * POST transaction
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, response, auth }) {

    
  

    const accountOwner = await Account.findBy('user_id', auth.user.id)
    const accountReceiver = await Account.findOrFail(params.accounts_id)


  
    const data = request.only([
      'value'
    ])

    if (data.value > (accountOwner.amount + accountOwner.limit)) {
      return response
          .status(400)
          .send({ error: { message: 'Saldo insuficiente' } })
  }

    accountReceiver.amount = accountReceiver.amount + data.value
    const Receiver = {
      amount: accountReceiver.amount
    }

    accountOwner.amount = accountOwner.amount - data.value
    const Owner = {
      amount: accountOwner.amount
    }

    const trx = await Database.beginTransaction()
    await accountReceiver.merge(Receiver)
    await accountReceiver.save(trx)
    await accountOwner.merge(Owner)
    await accountOwner.save(trx)
    const transaction = await Transaction.create({ value: data.value, account_receiver_id: params.accounts_id, account_owner_id: accountOwner.id, amount: accountOwner.amount })

    await trx.commit();


    await trx.rollback()


    return transaction
  }

  /**
   * Display a single transaction.
   * GET transaction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {

    const transaction = Transaction.find(params.id)
    return transaction
    
  }



  /**
   * Update transaction details.
   * PUT or PATCH transaction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update() {
    
  }

  /**
   * Delete a transaction with id.
   * DELETE transaction/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy() {

  }
}

module.exports = TransactionController
