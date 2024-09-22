import { createSlice } from "@reduxjs/toolkit";

const userConfigSlice = createSlice({
  name: "userConfig",
  initialState: {
    loading: true,
  },
  reducers: {
    setUserInfoLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetUserConfig: (state) => {
      state.loading = true;
    },
  },
});

export const { setUserInfoLoading, resetUserConfig } = userConfigSlice.actions;
export default userConfigSlice.reducer;
