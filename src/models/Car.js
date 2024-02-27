import mongoose from 'mongoose'



export const Car = new mongoose.Schema({
    title: {type: String, unique: true, required: true},
    horses: {type: Number, required: true},
    price: {type: Number, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})


export default mongoose.model('Car', Car)
