import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)
        
        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        vi.useFakeTimers() //cria o mock
    })

    afterEach(() => { 
        vi.useRealTimers() // Antes de cada teste cria o mock deixando as datas ficticias - Usa a data original
    })

    it ('should be able to check in', async () => {

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        await expect(checkIn.id).toEqual(expect.any(String))
    })

    it ('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        await expect(() => 
        checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it ('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it ('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-27.8107231),
            longitude: new Decimal(-50.3153888),
        })

        await expect(() =>
            checkInUseCase.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})