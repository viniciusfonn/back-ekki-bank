'use strict'

class Contact {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      contact_id: 'required'
    }
  }
}

module.exports = Contact
