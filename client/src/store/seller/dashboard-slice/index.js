import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSellerDashboardStats = createAsyncThunk(
  "sellerDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/seller/dashboard-stats", {withCredentials: true});
      console.log("Dashboard data:", data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch dashboard stats";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  stats: {
    totalProducts: 0,
    productChange: 0,
    pendingOrders: 0,
    pendingOrdersChange: 0,
    monthlySales: 0,
    salesChange: 0,
    conversionRate: 0,
  },
  recentOrders: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSellerDashboardStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalProducts: action.payload?.stats?.totalProducts || 0,
          productChange: action.payload?.stats?.productChange || 0,
          pendingOrders: action.payload?.stats?.pendingOrders || 0,
          pendingOrdersChange: action.payload?.stats?.pendingOrdersChange || 0,
          monthlySales: action.payload?.stats?.monthlySales || 0,
          salesChange: action.payload?.stats?.salesChange || 0,
          conversionRate: action.payload?.stats?.conversionRate || 0,
        };
        state.recentOrders = action.payload?.recentOrders || [];
      })
      .addCase(fetchSellerDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unexpected error";
      });
  },
});

export default dashboardSlice.reducer;