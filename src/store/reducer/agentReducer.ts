import  Agent  from "@/interfaces/agent";
import { createSlice } from "@reduxjs/toolkit";

// const api = "http://localhost:5000";



const initialState = {
  agent: null as Agent | null,
};

const userSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    logout: (state) => {
      state.agent = null;
      
    },
    addAgent: (state, action) => {
      state.agent = action.payload;
    },
  },
});

export const { logout, addAgent} = userSlice.actions;
export default userSlice.reducer;
