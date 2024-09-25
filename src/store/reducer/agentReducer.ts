import { Agent } from "@/interfaces/agent";
import { createSlice } from "@reduxjs/toolkit";

// const api = "http://localhost:5000";



const initialState = {
  agent: null as Agent | null,
  accessToken: null as string | null,
};

const userSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    logout: (state) => {
      state.agent = null;
      state.accessToken = null;
    },
    addAgent: (state, action) => {
      const agent = action.payload;
      console.log(agent);
      
      state.agent = agent;
    },
    updateAgent: (state, action) => {
      const { agent, accessToken } = action.payload;
      state.agent = agent;
      state.accessToken = accessToken;
    },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { logout, addAgent, updateAgent, updateToken } = userSlice.actions;
export default userSlice.reducer;
