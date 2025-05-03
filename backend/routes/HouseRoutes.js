import express from 'express';
import HouseController from '../controllers/HouseController.js';
import verifyToken from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/house',verifyToken, HouseController.postHouse);
router.get('/house/:id', HouseController.getHouse);
router.get('/allHouses',HouseController.getAllHouse);
export default router;