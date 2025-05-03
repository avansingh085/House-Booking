import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';
export const fetchHouses = createAsyncThunk(
  'house/fetchHouses',
  async (_, thunkAPI) => {
    try {
      console.log("hellow house is fetching")
      const response = await apiClient.get('/house/allHouses');
      console.log('Fetched houses:', response.data);
      return response.data.houses;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch houses'
      );
    }
  }
);

const initialState = {
  houses: [],
  filterData:{},
  mainDataHouse:[],
  loading: false,
  error: null,
};

const houseSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const filterData = action.payload;
      state.filterData = filterData;
    
      state.houses = state.mainDataHouse.filter((house) => {
        console.log(house.BookingDate, "BOOKING DATE");
    
        if (filterData.date) {
          const dates = Array.isArray(house.BookingDate) ? house.BookingDate : [];
          return !dates.some((date) => {
            console.log(date, "DATE");
            return filterData.date === date;
          });
        }
    
        return true; // If no filter date is provided, include all houses
      });
    }
  },    
  extraReducers: (builder) => {
    builder
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.houses = action.payload;
        state.mainDataHouse=action.payload;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        // console.error('Error fetching houses:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setFilter } = houseSlice.actions;
export default houseSlice.reducer;
