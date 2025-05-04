import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '30d',
    });
};
const AuthController = {
    register: async (req, res) => {
       
        const { name, email, password } = req.body;
       
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            const token = generateToken(newUser);
           return res.status(201).send({success:true, user: newUser, token });
        } catch (error) {
            console.log(error)
           return res.status(500).json({ message: 'Server error', error });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }).populate('bookingHouse');
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const token = generateToken(user);
           return res.status(200).send({ success:true,user, token });
        }
        catch (error) {
            console.log(error)
           return res.status(500).json({success:true, message: 'Server error', error });
        }
    },
}

export default AuthController;