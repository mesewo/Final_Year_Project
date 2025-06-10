// store/productRequest-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Seller actions
export const requestProduct = createAsyncThunk(
  "productRequest/requestProduct",
  async (payload) => {
    const res = await axios.post("http://localhost:5000/api/product-requests/request", payload, { withCredentials: true });
    return res.data;
  }
);

export const fetchMyRequests = createAsyncThunk(
  "productRequest/fetchMyRequests",
  async () => {
    const res = await axios.get("/api/product-requests/me");
    return res.data;
  }
);

// Storekeeper actions
export const fetchAllRequests = createAsyncThunk(
  "productRequest/fetchAllRequests",
  async () => {
    const res = await axios.get("/api/product-requests");
    return res.data;
  }
);

export const approveRequest = createAsyncThunk(
  "productRequest/approveRequest",
  async (id) => {
    const res = await axios.put(
      `/api/product-requests/approve/${id}`,
      {},
      { withCredentials: true }
    );
    // Return the updated request object, not the whole response
    return res.data.request;
  }
);

export const rejectRequest = createAsyncThunk(
  "productRequest/rejectRequest",
  async (id) => {
    const res = await axios.put(
      `/api/product-requests/reject/${id}`,
      {},
      { withCredentials: true }
    );
    return res.data.request;
  }
);

export const fetchProductRequestTrend = createAsyncThunk(
  "storeKeeperReports/fetchProductRequestTrend",
  async ({ start, end }) => {
    const response = await axios.get(
      `/api/product-requests/trend?start=${start.toISOString()}&end=${end.toISOString()}`
    );
    return response.data;
  }
);

// Bulk order actions
export const fetchAllBulkOrders = createAsyncThunk(
  "productRequest/fetchAllBulkOrders",
  async (storekeeperId) => {
    const res = await axios.get(`/api/product-requests/bulk/${storekeeperId}`);
    return res.data.orders;
  }
);

export const approveBulkOrder = createAsyncThunk(
  "productRequest/approveBulkOrder",
  async (orderId) => {
    const res = await axios.post(`/api/shop/orders/bulk/${orderId}/approve`);
    return res.data.order;
  }
);

export const rejectBulkOrder = createAsyncThunk(
  "productRequest/rejectBulkOrder",
  async (orderId) => {
    const res = await axios.post(`/api/shop/orders/bulk/${orderId}/reject`);
    return res.data.order;
  }
);

export const markRequestDelivered = createAsyncThunk(
  "productRequest/markRequestDelivered",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/product-requests/deliver/${requestId}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productRequestSlice = createSlice({
  name: "productRequest",
  initialState: {
    myRequests: [],
    allRequests: [],
    bulkOrders: [],
    status: "idle",
    error: null,
    productRequestTrend: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestProduct.fulfilled, (state, action) => {
        state.myRequests.push(action.payload);
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload.requests || [];
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.allRequests = action.payload.requests || [];
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allRequests = state.allRequests.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allRequests = state.allRequests.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(fetchProductRequestTrend.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProductRequestTrend.fulfilled, (state, action) => {
        state.productRequestTrend = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductRequestTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(approveBulkOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allRequests = state.allRequests.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(rejectBulkOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allRequests = state.allRequests.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(fetchAllBulkOrders.fulfilled, (state, action) => {
        state.bulkOrders = action.payload
      })
      .addCase(markRequestDelivered.fulfilled, (state, action) => {
        const updated = action.payload.request;
        state.allRequests = state.allRequests.map((r) =>
          r._id === updated._id ? updated : r
        );
      })
      .addCase(markRequestDelivered.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productRequestSlice.reducer;
