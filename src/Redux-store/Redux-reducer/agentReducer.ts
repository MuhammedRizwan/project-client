// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// interface UserSignupData {
//   agentname: string;
//   email: string;
//   password: string;
//   phone: string;
// }
// interface ApiResponse {
//   message: string;
//   data?: any;
// }

// const api = "https://localhost:5000";

// export const agentSignup = createAsyncThunk<ApiResponse, UserSignupData>(
//   "agent/signup",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post<ApiResponse>(`${api}agent/signup`, userData);
//       return response.data;
//     } catch (error) {
//       const err = error as any;
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// const initialState = {
//   user: null,
//   errorMessage: null,
//   loading: false,
//   error: null,
// };
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//     },
//   },
// });
// export const {logout}=userSlice.actions
// export default userSlice.reducer
