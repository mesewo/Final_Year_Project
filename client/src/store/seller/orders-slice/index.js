import { createSlice } from "@reduxjs/toolkit";

export const sellerOrdersSlice = createSlice({
  name: "sellerOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersFailure } = sellerOrdersSlice.actions;
export default sellerOrdersSlice.reducer;