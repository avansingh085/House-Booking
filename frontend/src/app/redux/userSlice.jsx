import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/user/user');
      console.log('User data fetched:', response.data);
      return response.data.user;
    } catch (error) {
      console.error('Fetch user error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Unknown error'
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  bookingHouse: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log('Fetch user failed:', action.payload); // debug
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});


export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
