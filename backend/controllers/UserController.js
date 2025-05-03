import User from '../models/User.js';
import House from '../models/House.js';
import OrderHouse from '../models/OrderHouse.js';
const UserController = {
    getUser: async (req, res) => {
        try {
            
            const user = await User.findById(req.user.id).select('-password').populate('orderHouse');
           
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
            return res.status(200).send({ success: true, user });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    },
    updateFavorite: async (req, res) => {
        const { id } = req.body;
        console.log(id, "ID--------------");
        try {

            const user = await User.findById(req.user.id).select('-password').populate('orderHouse');

            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }

            if (user.favorites.map(h => h.toString()).includes(id)) {
                user.favorites = user.favorites.filter((houseId) => houseId.toString() !== id);
                await user.save();
                return res.status(200).send({ success: true, message: 'House removed from favorites', user });
            }
    
            user.favorites.push(id);
            await user.save();
            return res.status(200).send({ success: true, message: 'House added to favorites', user });
        } catch (error) {
            console.log(error,"HELLO")
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    }
    ,
   
    addPastView: async (req, res) => {
        const { id } = req.body;
        try {
           
            const user = await User.findById(req.user.id).select('-password').populate('orderHouse');
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
            if (user.pastViews.includes(id)) {
                return res.status(400).send({ success: false, message: 'House already in past views' });
            }
            user.pastViews.push(id);
            await user.save();
            return res.status(200).send({ success: true, message: 'House added to past views', user });
        } catch (error) {
            console.log(error,"addPastView")
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    },
   
    orderHouse: async (req, res) => {
        try {
            let user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
           
            const data = req.body;
            const house = await House.findById(data.id);
            if (!house) {
                return res.status(404).send({ success: false, message: 'House not found' });
            }
            house.BookingDate.push(data.date);
            await house.save();

            const newOrder = new OrderHouse({
                houseId: data.id,
                amount: data.amount,
                date: data.date,
                orderId: data.orderId,
                paymentId: data.paymentId,
                signature: data.signature,
            });
           
            const savedOrder = await newOrder.save();
           
            user.orderHouse.push(savedOrder._id);
            await user.save();
            user = await User.findById(user._id).select('-password').populate('orderHouse');
            return res.status(200).send({ success: true, message: 'House added to buy houses', user });
        } catch (error) {
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    }


}
export default UserController;