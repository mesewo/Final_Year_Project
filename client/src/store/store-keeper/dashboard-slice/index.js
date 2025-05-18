import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

export const fetchStorekeeperDashboardStats = createAsyncThunk(
  'storekeeperDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/storekeeper/dashboard/stats');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRecentStoreOrders = createAsyncThunk(
  'storekeeperDashboard/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/storekeeper/orders/recent');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  stats: null,
  recentOrders: [],
  loading: false,
  error: null
};

const storekeeperDashboardSlice = createSlice({
  name: 'storekeeperDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorekeeperDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStorekeeperDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStorekeeperDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentStoreOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentStoreOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentStoreOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default storekeeperDashboardSlice.reducer;