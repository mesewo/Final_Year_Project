import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null
};

export const fetchAllUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async () => {
    const response = await axios.get("/api/admin/users");
    return response.data.data;
  }
);

export const blockUser = createAsyncThunk(
  "adminUsers/blockUser",
  async (userId) => {
    const response = await axios.put(`/api/admin/users/block/${userId}`);
    return response.data.data;
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u._id === action.payload._id);
        if (user) {
          user.isBlocked = true;
        }
      });
  }
});

export default adminUsersSlice.reducer;