import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {username: null, password: null, facilityId: null},
    reducers: {
        setCredentials(state, action){
            const { username, password} = action.payload;
            state.username = username;
            state.password = password;
        },
    },
})

export const { setCredentials} = userSlice.actions;
export default userSlice.reducer;