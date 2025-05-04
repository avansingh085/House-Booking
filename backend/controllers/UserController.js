import User from '../models/User.js';
import House from '../models/House.js';
import BookingHouse from '../models/BookingHouse.js';
const UserController = {
    getUser: async (req, res) => {
        try {
            
            const user = await User.findById(req.user.id).select('-password').populate('bookingHouse');
           
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
           const bookingHouse=user.bookingHouse;

            return res.status(200).send({ success: true, user,bookingHouse });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    },
    updateFavorite: async (req, res) => {
        const { id } = req.body;
        console.log(id, "ID--------------");
        try {

            const user = await User.findById(req.user.id).select('-password').populate('bookingHouse');

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
           
            const user = await User.findById(req.user.id).select('-password').populate('bookingHouse');
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
    updateUser:async(req, res) =>{
        try {
            console.log("update user");
            const { name, email, phoneNumber,profilePictureUrl} = req.body;
            const user = await User.findById(req.user.id).select('-password').populate('bookingHouse');
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
            user.name =name||user.name;
            user.email = email||user.email;
            user.phoneNumber = phoneNumber||user.phoneNumber;
            user.profilePictureUrl = profilePictureUrl||user.profilePictureUrl;

            await user.save();
            const updatedUser = await User.findById(user._id).select('-password').populate('bookingHouse');
            return res.status(200).send({ success: true, message: 'User updated'});
        }catch(error){
            console.log(error,"updateUser")
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
},
   
    bookingHouse: async (req, res) => {
        try {
           
            let user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
           
            const data = req.body;
            const house = await House.findById(data.houseId);
            if (!house) {
                return res.status(404).send({ success: false, message: 'House not found' });
            }
            house.BookingStatus.push(data.date);
            await house.save();

            const newBooking = new BookingHouse({
                houseId: data.houseId,
                amount: data.amount,
                date: data.date,
                orderId: data.orderId,
                paymentId: data.orderId,
                signature: data.orderId,
            });
           
            const saveBooking = await newBooking.save();
          
            user.bookingHouse.push(saveBooking._id);
            await user.save();
           
            const newUser = await User.findById(user._id).select('-password').populate('bookingHouse');
            const bookingHouse=newUser.bookingHouse;
            return res.status(200).send({ success: true, message: 'House added to buy houses', user:newUser,bookingHouse });
        } catch (error) {
           
            return res.status(500).send({ success: false, message: 'Server error', error });
        }
    }


}
export default UserController;