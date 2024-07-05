import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: user ? user : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const login = (userCredentials) => async (dispatch) => {
  try {
    const response = await axios.post("/api/v1/auth/login", userCredentials);
    const user = response.data.data.user;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(loginSuccess(user));
  } catch (error) {
    console.error("Failed to login:", error);
  }
};

export const { loginSuccess, logout } = authSlice.actions;
export const getUser = (state) => state.auth.user;
export const isLoggedIn = (state) => state.auth.isLoggedIn;
export default authSlice.reducer;
