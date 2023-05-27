import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { Cipher } from 'crypto'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { CheckInUseCase } from './check-in'

let checkInsRepository: CheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        checkInUseCase = new CheckInUseCase(checkInsRepository)

        vi.useFakeTimers() //cria o mock
    })

    afterEach(() => { 
        vi.useRealTimers() // Antes de cada teste cria o mock deixando as datas ficticias - Usa a data original
    })

    it ('should be able to check in', async () => {

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        })

        await expect(checkIn.id).toEqual(expect.any(String))
    })

    it ('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        })

        await expect(() => 
        checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        }),
        ).rejects.toBeInstanceOf(Error)
    })

    it ('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-1',
            userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})