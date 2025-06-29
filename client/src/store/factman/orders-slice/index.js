import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

export const getAllOrdersForFactman = createAsyncThunk(
  "/order/getAllOrdersForFactman",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/factman/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForFactman = createAsyncThunk(
  "/order/getOrderDetailsForFactman",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/factman/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/factman/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

const factmanOrdersSlice = createSlice({
  name: "factmanOrdersSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForFactman.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForFactman.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForFactman.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForFactman.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForFactman.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForFactman.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = factmanOrdersSlice.actions;

export default factmanOrdersSlice.reducer;
