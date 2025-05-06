import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  unsoldProducts: [],
  loading: false,
  error: null
};

export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetchAll",
  async (sellerId) => {
    const response = await axios.get(`/api/seller/products?seller=${sellerId}`);
    return response.data.data;
  }
);

export const fetchUnsoldProducts = createAsyncThunk(
  "sellerProducts/fetchUnsold",
  async (sellerId) => {
    const response = await axios.get(`/api/seller/products/unsold?seller=${sellerId}`);
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