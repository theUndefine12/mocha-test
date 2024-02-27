import express from 'express'
import {check} from 'express-validator'
import { authLogin, authRegister, getProfile, updateUser } from '../controllers/auth.controller.js'
import { authSecurity } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need be min 8').isLength({min: 8})
    ],
    authRegister
)

router.route('/login').post(
    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password is required and need be min 8').isLength({min: 8})
    ],
    authLogin
)

router.route('/').put(
    [
        check('name', 'Name is required').notEmpty()
    ],
    authSecurity, updateUser
)


router.route('/profile').get(authSecurity ,getProfile)

export default router
