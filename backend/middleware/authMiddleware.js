import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; 
    //  console.log(token,"hellow");
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.user = decoded;
        console.log(req.user,"USER")
        next();
    });
}

export default verifyToken;