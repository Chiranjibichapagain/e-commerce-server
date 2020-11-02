import request from 'supertest'

import User, { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b775678fa0b461c7c45'

async function createUser(override?: Partial<UserDocument>) {
    let user = {
        firstName: 'Dhanapati',
        lastName: 'Chapagain',
        email: 'dhanapati@gmail.com',
        password: 'Dhanapati'
    }

    if (override) {
        user = { ...user, ...override }
    }

    return await request(app)
        .post('/api/users')
        .send(user)
}

describe('user controller', () => {
    beforeEach(async () => {
        await dbHelper.connect()
    })

    afterEach(async () => {
        await dbHelper.clearDatabase()
    })

    afterAll(async () => {
        await dbHelper.closeDatabase()
    })

    it('should create a user', async () => {
        const res = await createUser()
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('_id')
        expect(res.body.firstName).toBe('Dhanapati')
    })

    it('should not create a user with wrong data', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                firstName: 'Dhanapati',
                // These fields should be included
                // lastName: 'Chapagain',
                email: 'dhanapati@gmail.com',
                password: '123'
            })
        expect(res.status).toBe(400)
    })

    it('should get back an existing user', async () => {
        let res = await createUser()
        expect(res.status).toBe(200)

        const userId = res.body._id
        res = await request(app)
            .get(`/api/users/${userId}`)

        expect(res.body._id).toEqual(userId)
    })

    it('should not get back a non-existing user', async () => {
        const res = await request(app)
            .get(`/api/users/${nonExistingUserId}`)
        expect(res.status).toBe(404)
    })

    it('should get back all users', async () => {
        const res1 = await createUser({
            firstName: 'Bimala',
            lastName: 'Chapagain',
            email: 'bimala@gmail.com',
            password: 'Bimala'
        })
        const res2 = await createUser({
            firstName: 'Sushila',
            lastName: 'Chapagain',
            email: 'sushila@gmail.com',
            password: 'Sushila'
        })

        const res3 = await request(app)
            .get('/api/users')

        expect(res3.body.length).toEqual(2)
        expect(res3.body[0]._id).toEqual(res1.body._id)
        expect(res3.body[1]._id).toEqual(res2.body._id)
    })

    it('should update an existing user', async () => {
        let res = await createUser()
        expect(res.status).toBe(200)

        const userId = res.body._id
        const update = {
            firstName: 'Mr. Dhanapati',
            lastName: 'Chapagain',
            email: 'dhanapati@gmail.com',
            password: 'Dhanapati'
        }

        res = await request(app)
            .put(`/api/users/${userId}`)
            .send(update)

        expect(res.status).toEqual(200)
        expect(res.body.firstName).toEqual('Mr. Dhanapati')
        expect(res.body.email).toEqual('dhanapati@gmail.com')
    })

    it('should delete an existing user', async () => {
        let res = await createUser()
        expect(res.status).toBe(200)
        const userId = res.body._id

        res = await request(app)
            .delete(`/api/users/${userId}`)

        expect(res.status).toEqual(204)

        res = await request(app)
            .get(`/api/users/${userId}`)
        expect(res.status).toBe(404)
    })
})
