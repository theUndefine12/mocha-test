import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../Models/User.js'
import { generateToken } from '../lib/jwt-token.js'


export const authRegister = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, email, password } = req.body

    try {
        const isHave = await User.findOne({ email })
        if (isHave) {
            res.status(400).json({ message: 'Email is Busy' })
        }
        const hash = bcrypt.hashSync(password, 7)
        const user = new User({ name, email, password: hash })

        await user.save()
        const token = generateToken(user.id)

        res.status(200).json({ message: 'User is Saved Successfully', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const authLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const truePassword = bcrypt.compareSync(password, user.password)
        if (!truePassword) {
            res.status(400).json({ message: 'Password is not Correct' })
        }

        const token = generateToken(user.id)
        res.status(200).json({ message: 'User is Signed', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
        return
    }
    const userId = req.userId
    const {name} = req.body

    const updateUser = await User.findByIdAndUpdate(userId, { $set: { name } }, { new: true })
    if (!updateUser) {
        res.status(400).json({ message: 'Please check your update request--' })
        return
    }
    
    res.status(200).json({ updateUser })
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    const profile = await User.findById(userId)
        .select('-password')
        .populate('cars')
    if (!profile) {
        res.status(404).json({ message: 'Progfile is not Found' })
    }

    res.status(200).json({ profile })
})

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('username postsCount subscribersCount subscriptionCount')
    res.status(200).json({ users })
})
