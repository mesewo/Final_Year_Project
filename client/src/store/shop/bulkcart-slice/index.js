import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  bulkCartItems: [],
  isLoading: false,
};

export const addToBulkCart = createAsyncThunk(
  "bulkCart/addToBulkCart",
  async ({ userId, productId, quantity }, thunkAPI) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/bulk-cart/add`,
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);



export const fetchBulkCartItems = createAsyncThunk(
  "bulkCart/fetchBulkCartItems",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/bulk-cart/get/${userId}`
    );
    return response.data;
  }
);

export const deleteBulkCartItem = createAsyncThunk(
  "bulkCart/deleteBulkCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }/api/shop/bulk-cart/${userId}/${productId}`
    );
    return response.data;
  }
);

export const updateBulkCartQuantity = createAsyncThunk(
  "bulkCart/updateBulkCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/bulk-cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

const bulkCartSlice = createSlice({
  name: "bulkCart",
  initialState,
  reducers: {
    clearBulkCart: (state) => {
      state.bulkCartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToBulkCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToBulkCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bulkCartItems = action.payload.data.items || [];
      })
      .addCase(addToBulkCart.rejected, (state) => {
        state.isLoading = false;
        state.bulkCartItems = [];
      })
      .addCase(fetchBulkCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBulkCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bulkCartItems = action.payload.data.items || [];
      })
      .addCase(fetchBulkCartItems.rejected, (state) => {
        state.isLoading = false;
        state.bulkCartItems = [];
      })
      .addCase(updateBulkCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBulkCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bulkCartItems = action.payload.data.items || [];
      })
      .addCase(updateBulkCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.bulkCartItems = [];
      })
      .addCase(deleteBulkCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBulkCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bulkCartItems = action.payload.data.items || [];
      })
      .addCase(deleteBulkCartItem.rejected, (state) => {
        state.isLoading = false;
        state.bulkCartItems = [];
      });
  },
});

export const { clearBulkCart } = bulkCartSlice.actions;
export default bulkCartSlice.reducer;
