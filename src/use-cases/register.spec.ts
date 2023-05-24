
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserCase } from './register'

// skip para pular testes
// only para testar um teste específico

describe('Register Use Case', () => {
    it ('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it ('should hash user password upon repository', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash,
        )

        expect(isPasswordCorrectlyHashed).toBe(true)

    })


    it ('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const email = 'johndoe@example.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() => 
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})