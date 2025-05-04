import express from 'express';
import UserController from '../controllers/UserController.js';
import  verifyToken  from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/user', verifyToken, UserController.getUser);
router.post('/user/favorite', verifyToken, UserController.updateFavorite);
router.post('/user/addPastView', verifyToken, UserController.addPastView);
router.post('/user/bookingHouse', verifyToken, UserController.bookingHouse);
router.post('/user/updateUser', verifyToken, UserController.updateUser);

export default router;