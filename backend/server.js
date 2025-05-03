import express from 'express';
import app from './app.js';
import connectDB from './lib/database.js';
connectDB();

app.listen(3001,()=>{
    console.log("Server is running on port 3001")
});
