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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/store-keeper/inventory");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProductStock = createAsyncThunk(
  "inventory/updateStock",
  async ({ productId, quantity, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/store-keeper/inventory/${productId}`, {
        quantity,
        notes
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const inventorySlice = createSlice({
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
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
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

export default inventorySlice.reducer;