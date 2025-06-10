import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};


export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/shop/order/create", orderData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture",
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/user/${userId}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/details/${id}`
    );

    return response.data;
  }
);

// export const approveBulkOrder = createAsyncThunk(
//   "order/approveBulkOrder",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`/api/shop/orders/bulk/${orderId}/approve`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const rejectBulkOrder = createAsyncThunk(
//   "order/rejectBulkOrder",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`/api/shop/orders/bulk/${orderId}/reject`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL || null;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
      // .addCase(approveBulkOrder.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(approveBulkOrder.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const updatedOrder = state.orderList.find(
      //     (order) => order._id === action.payload.data._id
      //   );
      //   if (updatedOrder) {
      //     Object.assign(updatedOrder, action.payload.data);
      //   }
      // })
      // .addCase(approveBulkOrder.rejected, (state) => {
      //   state.isLoading = false;
      // })
      // .addCase(rejectBulkOrder.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(rejectBulkOrder.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   const updatedOrder = state.orderList.find(
      //     (order) => order._id === action.payload.data._id
      //   );
      //   if (updatedOrder) {
      //     Object.assign(updatedOrder, action.payload.data);
      //   }
      // })
      // .addCase(rejectBulkOrder.rejected, (state) => {
      //   state.isLoading = false;
      // });
  },
});

export const { resetOrderDetails, clearCart } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
