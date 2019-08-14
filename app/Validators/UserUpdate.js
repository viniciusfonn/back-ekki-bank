'use strict'
const Antl = use('Antl')

class User {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      cpf: 'unique:users',
      cellphone: 'unique:users',
      password: 'confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User
