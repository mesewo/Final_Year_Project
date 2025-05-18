import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch orders
export const fetchSellerOrders = createAsyncThunk(
  "sellerOrders/fetchSellerOrders",
  async (sellerId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/seller/orders/get?sellerId=${sellerId}`);
      return response.data.data; // Only the array of orders
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "sellerOrders/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/seller/orders/update/${orderId}`, { orderStatus: status });
      return response.data.data; // Only the updated order
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sellerOrdersSlice = createSlice({
  name: "sellerOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSellerOrders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerOrdersSlice.reducer;