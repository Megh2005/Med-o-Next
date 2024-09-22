import { createSlice } from "@reduxjs/toolkit";

const conversationsConfigSlice = createSlice({
  name: "conversationsConfig",
  initialState: {
    hasMoreConversations: true,
    loading: true,
  },
  reducers: {
    setHasMoreConversations: (state, action) => {
      state.hasMoreConversations = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetConversationConfig: (state) => {
      state.hasMoreConversations = true;
      state.loading = true;
    },
  },
});

export const { setHasMoreConversations, setLoading, resetConversationConfig } =
  conversationsConfigSlice.actions;
export default conversationsConfigSlice.reducer;
