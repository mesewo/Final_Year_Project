import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  inventory: [],
  lowStockItems: [],
  loading: false,
  error: null
};

export const fetchInventory = createAsyncThunk(
  "inventory/fetchAll",
  async (filter = "", { rejectWithValue }) => {
    try {
      // Build the URL with filter if provided
      let url = "/api/storekeeper/inventory";
      if (filter) {
        url += `?filter=${filter}`;
      }
      const response = await axios.get(url);
      // Your backend returns { success, data: [...] }
      return response.data.data || response.data.products || [];
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const requestStockReplenishment = createAsyncThunk(
  "inventory/requestStockReplenishment",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/product-requests/request",
        { productId, quantity }, // add storeId if needed
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  "inventory/updateStock",
  async ({ productId, quantity, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/storekeeper/inventory/${productId}`, {
        quantity,
        notes
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const StoreKeeperInventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
        state.lowStockItems = action.payload.filter(
          item => item.currentStock <= item.lowStockThreshold
        );
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
      })
      .addCase(requestStockReplenishment.fulfilled, (state, action) => {
        state.inventory.push(action.payload);
      })

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export default StoreKeeperInventorySlice.reducer;