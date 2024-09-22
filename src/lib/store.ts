import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import invitationSlice from "./features/invitation/invitationSlice";
import invitationConfigSlice from "./features/invitation/invitationConfigSlice";
import conversationsSlice from "./features/conversations/conversationsSlice";
import conversationsConfigSlice from "./features/conversations/conversationsConfigSlice";
import userConfigSlice from "./features/user/userConfig";
import conversationDetailsSlice from "./features/conversationDetails/conversationDetailsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      invitation: invitationSlice,
      invitationConfig: invitationConfigSlice,
      conversations: conversationsSlice,
      conversationsConfig: conversationsConfigSlice,
      userConfig: userConfigSlice,
      conversationDetails: conversationDetailsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
