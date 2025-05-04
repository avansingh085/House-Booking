import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import HouseRoutes from './routes/HouseRoutes.js';
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors({
  origin: '*',
  credentials: true, 
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/house', HouseRoutes);

export default app;
