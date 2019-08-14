'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table
        .integer('account_owner_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('account_receiver_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable() 
      table
        .float('value')
        .notNullable()
      table
        .float('amount')
        .notNullable()    
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
