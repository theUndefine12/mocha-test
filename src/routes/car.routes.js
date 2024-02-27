import express from 'express'
import {check} from 'express-validator'
import { authSecurity } from '../middleware/auth.middleware.js'
import { createCar, deleteCar, getAllCars, getCar, getMyCars } from '../controllers/car.controller.js'


const router = express.Router()

router.route('/create').post(
    [
        check('title', 'Title is required').notEmpty(),
        check('horses', 'Horses is required').notEmpty(),
        check('price', 'Price is required').notEmpty(),
    ],
    authSecurity, createCar
)

router.route('/').get(authSecurity, getAllCars)
router.route('/my-cars').get(authSecurity, getMyCars)

router.route('/:id').get(authSecurity, getCar)

router.route('/:id').put(
    [
        check('title', 'Title is required').notEmpty(),
        check('horses', 'Horses is required').notEmpty(),
        check('price', 'Price is required').notEmpty(),
    ],
    authSecurity, createCar
)

router.route('/:id').delete(authSecurity, deleteCar)


export default router
