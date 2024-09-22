import { createSlice } from "@reduxjs/toolkit";

const invitationConfigSlice = createSlice({
  name: "invitationConfig",
  initialState: {
    hasMoreInvitations: true,
    invitationLoading: true,
  },
  reducers: {
    setHasMoreInvitations: (state, action) => {
      state.hasMoreInvitations = action.payload;
    },
    setInvitationLoading: (state, action) => {
      state.invitationLoading = action.payload;
    },
    resetInvitationConfig: (state) => {
      state.hasMoreInvitations = true;
      state.invitationLoading = true;
    },
  },
});

export const {
  setHasMoreInvitations,
  setInvitationLoading,
  resetInvitationConfig,
} = invitationConfigSlice.actions;
export default invitationConfigSlice.reducer;
