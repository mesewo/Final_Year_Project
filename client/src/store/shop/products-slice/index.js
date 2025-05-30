import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  featuredStoreProducts: [],
  storeProducts: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    console.log(result);

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);


export const fetchPublicStoreProducts = createAsyncThunk(
  "/products/fetchPublicStoreProductsByStore",
  async (storeId) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/public-store/${storeId}/products`
    );
    return result.data.data;
  }
);

// This function fetches products from a public store by its ID

export const fetchStoreProductStock = createAsyncThunk(
  "/products/fetchStoreProductStock",
  async ({ productId, storeId }) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/store-product-stock/${productId}/${storeId}`
    );
    return result.data;
  }
);


const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchPublicStoreProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicStoreProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storeProducts = action.payload; // <--- THIS IS IMPORTANT
      })
      .addCase(fetchPublicStoreProducts.rejected, (state) => {
        state.isLoading = false;
        state.storeProducts = [];
      });
      
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
