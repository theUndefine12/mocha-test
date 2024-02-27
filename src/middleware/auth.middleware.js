import jwt from 'jsonwebtoken';


export const authSecurity = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return res.status(400).json({ message: 'Please Put Token' })
        }
        const code = process.env.JWT_SECRET

        const token = authorizationHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, code)
        req.userId = decodedToken.userId
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: 'Invalid Token' })
    }
}