'use strict'

class SessionController {
    async store ({ request, response, auth}) {
        const { cpf, password} = request.all() 

        const token = await auth.attempt(cpf, password)

        return token
    }
}

module.exports = SessionController
