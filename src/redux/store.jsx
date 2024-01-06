import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/UserSlice"
import themeReducer from "./slice/ThemeSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});