import { createSlice } from "@reduxjs/toolkit";

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
  accessToken: null as string | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    addUser: (state, action) => {      
      const user = action.payload;
      state.user = user;
    },
    updateUser: (state, action) => {      
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { logout, addUser, updateUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
