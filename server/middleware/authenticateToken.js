import jwt from 'jasonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export default function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.sendStatus(401).json({ error: "Access Token required"})

    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403).json({ error: "Invalid Token"})
            
        req.user = user
        next()
    } )
}
