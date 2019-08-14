'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transaction extends Model {
    account () {
        return this.belongsToMany('App/Models/Account')
    }
}

module.exports = Transaction
