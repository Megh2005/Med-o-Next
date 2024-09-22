import { Invitation } from "@/models/invitation.model";
import { createSlice } from "@reduxjs/toolkit";

export interface CustomInvitation extends Invitation {
  sender: any;
}

const invitationSlice = createSlice({
  name: "invitation",
  initialState: {
    invitations: {} as Record<string, CustomInvitation>,
  },
  reducers: {
    setInvitations: (state, action) => {
      const invitationsList = action.payload as Array<any>;
      invitationsList.map((invitation) => {
        state.invitations[invitation._id] = invitation;
      });
    },
    addInvitation: (state, action) => {
      const newInvitation = action.payload;
      state.invitations[newInvitation._id] = newInvitation;
    },
    deleteInvitation: (state, action) => {
      delete state.invitations[action.payload as string];
    },
    removeInvitations: (state) => {
      state.invitations = {};
    },
  },
});

export const {
  setInvitations,
  addInvitation,
  deleteInvitation,
  removeInvitations,
} = invitationSlice.actions;
export default invitationSlice.reducer;
