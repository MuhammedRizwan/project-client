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
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
    },
    addAdmin: (state, action) => {      
      state.admin = action.payload;
    },
  },
});

export const { logout, addAdmin } = adminSlice.actions;
export default adminSlice.reducer;
