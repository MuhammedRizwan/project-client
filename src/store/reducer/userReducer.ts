import User from "@/interfaces/user";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";



const initialState = {
  user: null as User | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("lastChattedRoom")
      state.user = null;
      
    },
    addUser: (state, action) => {    
      state.user = action.payload;
    },
    
  },
});

export const { logout, addUser } = userSlice.actions;
export default userSlice.reducer;
