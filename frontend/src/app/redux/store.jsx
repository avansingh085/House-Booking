import { configureStore } from '@reduxjs/toolkit';
import houseReducer from './houseSlice';
import userReducer from './userSlice';
 const store = configureStore({
  reducer: {
    house: houseReducer,
    user: userReducer,
  },
});
export  default store;
