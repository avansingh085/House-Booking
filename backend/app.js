import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import HouseRoutes from './routes/HouseRoutes.js';
import dotenv from "dotenv";
dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:3000", 'https://house-booking-xi.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/house', HouseRoutes);

export default app;
