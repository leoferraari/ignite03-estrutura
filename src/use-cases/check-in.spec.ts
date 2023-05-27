import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { CheckInUseCase } from './check-in'

let checkInsRepository: CheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        checkInUseCase = new CheckInUseCase(checkInsRepository)
    })

    it ('should be able to check in', async () => {

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        })

        await expect(checkIn.id).toEqual(expect.any(String))
    })
})