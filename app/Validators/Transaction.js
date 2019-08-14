'use strict'

class Transaction {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      value: 'required'
    }
  }
}

module.exports = Transaction
