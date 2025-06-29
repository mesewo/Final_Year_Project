import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/factman/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/factman/products/get`
    );

    return result?.data;
  }
);

export const fetchProductWithFeedbacks = createAsyncThunk(
  "/products/fetchProductWithFeedbacks",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/factman/products/${id}/details`
    );
    return result?.data?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/factman/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/factman/products/delete/${id}`
    );

    return result?.data;
  }
);

const FactmanProductsSlice = createSlice({
  name: "factmanProducts",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductWithFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductWithFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductWithFeedbacks.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { clearProductDetails } = FactmanProductsSlice.actions;
export default FactmanProductsSlice.reducer;
