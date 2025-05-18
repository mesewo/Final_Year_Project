import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  unsoldProducts: [],
  loading: false,
  error: null,
};

// Fetch products for the authenticated seller
export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetchAll",
  async () => {
    const response = await axios.get(`/api/seller/products`, { withCredentials: true }); // No need to pass sellerId here
    return response.data.data;
  }
);

export const fetchUnsoldProducts = createAsyncThunk(
  "sellerProducts/fetchUnsold",
  async () => {
    const response = await axios.get(`/api/seller/products/unsold`, { withCredentials: true });
    return response.data.data;
  }
);

const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      
      .addCase(fetchUnsoldProducts.fulfilled, (state, action) => {
        state.unsoldProducts = action.payload;
      });
  }
});

export default sellerProductsSlice.reducer;