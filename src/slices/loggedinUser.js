import { createSlice } from "@reduxjs/toolkit";

export const loggedinUser = createSlice({
    name: 'userLoginInfo',
    initialState: {
        userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    },
    reducers: {
      userLoginInfo: (state, action) => {
        state.userInfo = action.payload;
      }
    },
});

export const { userLoginInfo } = loggedinUser.actions;
export default loggedinUser.reducer;
  