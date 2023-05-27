import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let userProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        userProfileUseCase = new GetUserProfileUseCase(usersRepository)
    })

    it ('should be able to get user profile', async () => {
        
        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await userProfileUseCase.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('John Doe')
    })

    it ('should be able to get user profile with wrong id', async () => {

        expect(() =>
            userProfileUseCase.execute({
                userId: 'non-existing-id',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})