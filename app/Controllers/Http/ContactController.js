'use strict'

const Contact = use('App/Models/Contact')
const Database = use('Database')



/**
 * Resourceful controller for interacting with contacts
 */
class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, auth }) {

    const contact = await Database
      .select('users.name','contacts.contact_id','contacts.id')
      .from('contacts')
      .innerJoin('users', 'users.id', 'contacts.contact_id')
      .where('user_id', auth.user.id)

    if (!contact) {
      return response
        .status(404)
        .send({ error: { message: 'Não encontrado nenhum contato para esse usuário' } })
    }

    return contact
  }


  /**
   * Render a form to be used for creating a new contact.
   * GET contacts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request,response, auth }) {

    const { contact_id } = request.only(['contact_id'])

    const userHasContact = await Database
    .select('*')
    .from('contacts')
    .where('user_id', auth.user.id)
    .andWhere('contact_id',contact_id)
    if (userHasContact[0]) {
      return response
        .status(401)
        .send({ error: { message: 'Esse usuário já esta adicionado' } })
    }

    const contact = await Contact.create({ contact_id: contact_id, user_id: auth.user.id })

    return contact

  }


  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params}) {
    const contact = await Contact.findOrFail(params.id)
  
    return contact

  }


  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update() {

  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params,response, auth }) {

    const contact = await Contact.find(params.id)
  
    if (auth.user.id !== contact.user_id) {
      return response
        .status(401)
        .send({ error: { message: 'Acesso não autorizado' } })
    }

    await contact.delete()
  }
}

module.exports = ContactController
