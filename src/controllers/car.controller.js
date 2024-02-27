import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Car from '../models/Car.js'
import User from '../Models/User.js'



export const createCar = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const userId = req.userId
    const {title , horses, price} = req.body

    try {
        const isHave = await Car.findOne({title})
        if(isHave) {
            res.status(400).json({message: 'Car with this title is have'})
        }

        const car = new Car({title, horses, price, owner: userId})
        await car.save()

        const user = await User.findById(userId)
        .populate('cars')

        user.cars.push(car.id)
        user.carsCount += 1
        await user.save()

        res.status(200).json({message: 'Car is created successfuly', car})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})


export const getAllCars = asyncHandler(async(req, res) => {
    const cars = await Car.find()
    res.status(200).json({cars})
})


export const getCar = asyncHandler(async(req, res) => {
    const {id} = req.params

    try {
        const car = await Car.findById(id)
        if(!car) {
            res.status(404).json({message: 'Car is not found'})
        }

        res.status(200).json({car})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})


export const getMyCars = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        .select('carsCount cars').populate('cars')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
});


export const updateCar = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const userId = req.userId
    const {id} = req.params
    const {title, horses, price} = req.body

    try {
        const car = await Car.findById(id)
        if(!car) {
            res.status(404).json({message: 'Car is not found'})
        }

        const isUser = car.owner.toString() === userId
        if(!isUser) {
            res.status(400).json({message: 'You have not rights for this'})
            return
        }

        const update = await Car.findByIdAndUpdate(id, {
            $set: {title, horses, price}
        }, {new: true})

        if(!update) {
            res.status(400).json({message: 'Error in Update'})
            return
        }

        res.status(200).json({update})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})


export const deleteCar = asyncHandler(async(req, res) => {
    const userId = req.userId
    const {id} = req.params

    try {
        const car = await Car.findById(id)
        if(!car) {
            res.status(404).json({message: 'Car is not found'})
        }

        const isUser = car.owner.toString() === userId
        if(!isUser) {
            res.status(400).json({message: 'You have not rights for this'})
            return
        }

        const deleted = await Car.findByIdAndDelete(id)
        res.status(200).json({message: 'Car is Deleted'})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})
