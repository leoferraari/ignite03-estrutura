import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh (request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({
        onlyCookie: true //Verifica se nos cookies da requisição existe o refresh token. Se não existir o código abaixo não é executado.
    })

    const { role } = request.user

    const token = await reply.jwtSign(
        { role }, {
        sign: {
            sub: request.user.sub,
        },
    })

    // O usuário perde a autenticação se ficar 7 dias sem entrar na aplicação.
    const refreshToken = await reply.jwtSign(
        {
            role,
        },
         {
        sign: {
            sub: request.user.sub,
            expiresIn: '7d'
        },
    })

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .status(200).send({
        token
    })
}