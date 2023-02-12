import { createSlice } from "@reduxjs/toolkit";

export const activeChatSlice = createSlice({
    name: "activeUserChat",
    initialState: {
      value: null,
    },
    reducers: {
      activeUserChat: (state, action) => {
        state.value = action.payload;
      },
    },
  });
  
  export const { activeUserChat } = activeChatSlice.actions;
  
  export default activeChatSlice.reducer;