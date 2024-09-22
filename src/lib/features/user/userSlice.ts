import { createSlice } from "@reduxjs/toolkit";

export interface UserInfo {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface UserState {
  info: UserInfo | null;
}

// Define the initial state
const initialState: UserState = {
  info: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { uid, email, displayName, photoURL } = action.payload;
      state.info = {
        uid,
        email,
        displayName,
        photoURL,
      };
    },
    removeUser: (state) => {
      state.info = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
