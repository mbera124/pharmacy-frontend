import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: { color: "#200637"},
  reducers: {
    setThemeColour(state, action) {
      const { color } = action.payload;
      state.color = color;
    },
  },
});

export const { setThemeColour } = themeSlice.actions;
export default themeSlice.reducer;
