import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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
      Cookies.remove("adminToken");
      Cookies.remove("adminRefreshToken");
      state.admin = null;
    },
    addAdmin: (state, action) => {      
      state.admin = action.payload;
    },
  },
});

export const { logout, addAdmin } = adminSlice.actions;
export default adminSlice.reducer;
