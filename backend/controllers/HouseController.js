import express from 'express';
import House from '../models/House.js';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';
import OrderHouse from '../models/BookingHouse.js';
const HouseController = {
    listHouse: async (req, res) => {
        
        try {
            const newHouse = new House(req.body);
            await newHouse.save();
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            user.houseListed.push(newHouse._id);
            await user.save();

            return res.status(201).json({ success: true, message: 'House posted successfully', house: newHouse });
        } catch (error) {
            console.log(error,"HELLOW");

            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    },
    getHouse: async (req, res) => {
        const { id } = req.params;
        try {
            const house = await House.findById(id);
            if (!house) {
                return res.status(404).json({ success: false, message: 'House not found' });
            }
            return res.status(200).json({ success: true, house });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    },
    getAllHouse: async (req, res) => {
        try {
            const houses = await House.find();
          
            if (!houses || houses.length === 0) {
                return res.status(404).send({ success: false, message: 'No houses found' });
            }
    
            return res.status(200).send({ success: true, houses });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    },
    getContactInfo:async (req,res)=>{
        let id=req.query.id;
        try{
           const user = await User.findOne({ houseListed: { $in: [id] } });
           console.log(user.name,user.email);
           return res.status(200).send({success:true,name:user.name,email:user.email,phoneNumber:user.phoneNumber});
        }
        catch(err)
        {
          return res.status(500).send({success:false,message:"server error or id not valid"})
        }
    }
    
  
}
export default HouseController;