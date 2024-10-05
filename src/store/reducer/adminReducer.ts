import { createSlice } from "@reduxjs/toolkit";

// const api = "http://localhost:5000";

interface Admin {
  _id?: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
}

const initialState = {
  admin: null as Admin | null,
  accessToken: null as string | null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.accessToken = null;
    },
    addAdmin: (state, action) => {      
      const { admin, accessToken } = action.payload;
      state.admin = admin;
      state.accessToken = accessToken;
    },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { logout, addAdmin, updateToken } = adminSlice.actions;
export default adminSlice.reducer;
