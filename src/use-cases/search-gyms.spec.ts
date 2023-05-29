import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
    
    })

    it ('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        const { gyms } = await searchGymsUseCase.execute({
            query: 'JavaScript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym'}),
        ])
    })


    it ('should be able to fetch paginated check-in history', async () => {

        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -27.2092052,
                longitude: -49.6401091
            })
        }

        const { gyms } = await searchGymsUseCase.execute({
            query: 'JavaScript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21'}),
            expect.objectContaining({ title: 'JavaScript Gym 22'}),
        ])
    })
})