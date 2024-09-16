import {  createSlice } from "@reduxjs/toolkit";

// const api = "http://localhost:5000";



const initialState = {
  user: null as string|null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { logout,addUser } = userSlice.actions;
export default userSlice.reducer;

