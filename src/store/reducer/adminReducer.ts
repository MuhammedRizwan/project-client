import Admin from "@/interfaces/admin";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";



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
