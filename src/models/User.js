import mongoose from 'mongoose'



const User = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    carsCount: {type: Number, default: 0},
    cars: [{type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
}) 

export default mongoose.model('User', User)
