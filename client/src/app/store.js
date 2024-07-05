import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/auth/authSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
