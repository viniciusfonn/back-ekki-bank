'use strict'

const User = use('App/Models/User')

class UserController {
    async index() {
        const users = User.all()

        return users;
    }

    async store({ request }) {
        const data = request.only(['name', 'cpf', 'password', 'cellphone'])

        const user = await User.create(data)

        return user
    }

    async show({ params }) {
        const user = await User.findOrFail(params.id)
        await user.load('account')

        return user
    }

    async update({ params, request, response, auth }) {
        const user = await User.findOrFail(params.id)

        if (auth.user.id !== user.id) {
            return response
                .status(401)
                .send({ error: { message: 'Acesso não autorizado' } })
        }

        const data = await request.only(['name', 'cpf', 'password', 'cellphone'])

        user.merge(data)
        await user.save()

        return user

    }

    async destroy({ params, response, auth }) {
        const user = await User.findOrFail(params.id)

        if (auth.user.id !== user.id) {
            return response
                .status(401)
                .send({ error: { message: 'Acesso não autorizado' } })
        }

        await user.delete()
    }
}

module.exports = UserController
