import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { RegisterUserCase } from '@/use-cases/register'


export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUserCase(
            usersRepository
        )

        await registerUseCase.execute({
            name,
            email,
            password
        })
    } catch(err) {
        return reply.status(409).send()
    }

    return reply.status(201).send()
}