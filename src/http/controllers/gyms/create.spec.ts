const request = require('supertest');
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { afterAll, beforeAll, describe, expect, it } from 'vitest'


describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some Description',
                phone: '090907804',
                latitude: -27.2092052,
                longitude: -49.6401091,
            })

        expect(response.statusCode).toEqual(201)
    })
})