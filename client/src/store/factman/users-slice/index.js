import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
  "factmanUsers/fetchAll",
  async () => {
    const response = await axios.get("/api/factman/users");
    return response.data.data;
  }
);

export const blockUser = createAsyncThunk(
  "adminUsers/blockUser",
  async (userId) => {
    const response = await axios.put(`/api/factman/users/block/${userId}`);
    return response.data.data;
  }
);

export const unblockUser = createAsyncThunk(
  "adminUsers/unblockUser",
  async (userId) => {
    const response = await axios.put(`/api/factman/users/unblock/${userId}`);
    return response.data.data;
  }
);
export const createUser = createAsyncThunk(
  "adminUsers/create",
  async (newUserData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/factman/users", newUserData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ id, data }) => {
    const response = await axios.put(`/api/factman/users/${id}`, data);
    return response.data.data;
  }
);

export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue("Invalid user ID");
    }
    try {
      const response = await axios.delete(`/api/factman/users/${id}`);
      return response.data.data; // Ensure response includes deleted user data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const factmanUsersSlice = createSlice({
  name: "factmanUsers",
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
        const user = state.users.find((u) => u._id === action.payload._id);
        if (user) {
          user.isBlocked = true;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload._id);
        if (user) {
          user.isBlocked = false;
        }
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload._id;
        state.users = state.users.filter((user) => user._id !== deletedUserId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default factmanUsersSlice.reducer;