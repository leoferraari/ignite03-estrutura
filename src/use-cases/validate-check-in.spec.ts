import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'


let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)
    

        vi.useFakeTimers() //cria o mock
    })

    afterEach(() => { 
        vi.useRealTimers() // Antes de cada teste cria o mock deixando as datas ficticias - Usa a data original
    })

    it ('should be able to validate the check-in', async () => {

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })



        const { checkIn } = await validateCheckInUseCase.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it ('should not be able to validate inexistent check-in', async () => {
        await expect(() => 
            validateCheckInUseCase.execute({
                checkInId: 'inexistent-check-in-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})