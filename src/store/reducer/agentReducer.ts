import  Agent  from "@/interfaces/agent";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// 



const initialState = {
  agent: null as Agent | null,
};

const userSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("agentToken");
      Cookies.remove("agentRefreshToken");
      state.agent = null;
      
    },
    addAgent: (state, action) => {
      state.agent = action.payload;
    },
  },
});

export const { logout, addAgent} = userSlice.actions;
export default userSlice.reducer;
