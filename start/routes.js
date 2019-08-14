'use strict'

const Route = use('Route')



Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('users', 'UserController.store').validator('UserStore')

Route.group(() => {
    Route.get('users/:id', 'UserController.show')
    Route.get('users', 'UserController.index')
    Route.put('users/:id', 'UserController.update').validator('UserUpdate')
    Route.delete('users/:id', 'UserController.destroy')

    Route.resource('accounts', 'AccountController').apiOnly()

    Route.resource('accounts.transactions', 'TransactionController').apiOnly().validator(
        new Map(
            [
                [
                    ['accounts.transactions.store'],
                    ['Transaction']
                ]
               
            ]
        )
    )

    Route.resource('users.contacts', 'ContactController').apiOnly().validator(
        new Map(
            [
                [
                    ['users.contacts.store'],
                    ['Contact']
                ]
            ]
        )
    )

}).middleware(['auth'])

