import express from 'express'
import mongoose from 'mongoose'
import 'colors'
import dotenv from 'dotenv'

import authRoutes from './src/routes/auth.routes.js'
import carRoutes from './src/routes/car.routes.js'

dotenv.config()

const app = express()
const port = 3000
const db = process.env.URL


app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/car', carRoutes)

export default app

const connect = async () => {
    await mongoose.connect(db)
        .then(console.log('DB Connected'.italic.bgGreen))

    app.listen(port, () => {
        console.log(`Server run on port ${port}`.italic.bgBlue)
    })
}

connect()