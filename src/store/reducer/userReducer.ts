import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// const api = "http://localhost:5000";

interface Iuser {
  _id?: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  friends?: string[];
  is_verified?: boolean;
  is_block?: boolean;
  profile_picture?: string;
}

const initialState = {
  user: null as Iuser | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      state.user = null;
      
    },
    addUser: (state, action) => {    
      state.user = action.payload;
    },
    
  },
});

export const { logout, addUser } = userSlice.actions;
export default userSlice.reducer;
