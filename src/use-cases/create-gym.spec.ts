import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

// skip para pular testes
// only para testar um teste específico

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        createGymUseCase = new CreateGymUseCase(gymsRepository)
    })

    it ('should be able to register', async () => {
        const { gym } = await createGymUseCase.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})