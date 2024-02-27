import *as chai from 'chai'
import supertest from 'supertest'
import Car from '../models/Car.js'
import server from '../../server.js'
import mongoose from 'mongoose'
import User from '../Models/User.js'

const { expect, should } = chai
const request = supertest(server)
const db = process.env.URL

before(async function () {
    this.timeout(5000)
    await mongoose.connect(db)
    await Car.deleteMany()
    await User.deleteMany()
})

after(async function () {
    await Car.deleteMany()
    await User.deleteMany()
    await mongoose.disconnect()
})


describe('Auth Test Collection', function() {
    let token

    it('should verify sign up request', async function() {
        const user = {
            'name': 'Test',
            'email': 'test@gmail.com',
            'password': '12345678'
        }

        const res = await request.post('/api/auth/signup')
        .send(user)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify login request', async function() {
        const user = {
            'email': 'test@gmail.com',
            'password': '12345678'
        }

        const res = await request.post('/api/auth/login')
        .send(user)
        token = res.body.token

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify get profile request', async function() {
        const res = await request.get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify update name request', async function() {
        const name = { 'name': 'Test2' }
        const res = await request.put(`/api/auth/`)
        .send(name)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })
})


describe('Car Test Collection', function () {
    let carId
    let token

    it('should verify login for take token request', async function() {
        const user = {
            'email': 'test@gmail.com',
            'password': '12345678'
        }

        const res = await request.post('/api/auth/login')
        .send(user)
        token = res.body.token

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('should verify that we have no cars in the database request', async function () {
            const res = await request.get('/api/car')
            .set('Authorization', `Bearer ${token}`)

            expect(res.status).to.equal(200)
            expect(res.body.cars).to.have.length(0)
    })

    it('should verify car create function request',async function() {
        const car = {
            'title': 'Bmw',
            'horses': 1000,
            'price': 2000000
        }

        const res = await request.post('/api/car/create')
        .set('Authorization', `Bearer ${token}`)
        .send(car)
        carId = res.body.car._id

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })
    
    it('should get car by id request', async function() {
        const res = await request.get(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('sould verify get my cars', async function() {
        const res = await request.get(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${token}`)
    
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('sould verify car update request', async function() {
        const data = {title: 'Amg', horses: 1000, price: 2000000}
        const res = await request.put(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
    
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object')
    })

    it('sould verify car delete request', async function() {
        const res = await request.delete(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${token}`)
    
        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal('Car is Deleted')
    })
})
