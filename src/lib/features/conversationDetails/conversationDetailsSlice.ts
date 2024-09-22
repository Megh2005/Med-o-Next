import { ConversationDetails } from "@/interfaces/ConversationDetails";
import { createSlice } from "@reduxjs/toolkit";

const conversationDetailsSlice = createSlice({
  name: "conversationDetails",
  initialState: {
    conversationDetails: {} as Record<string, ConversationDetails>,
  },
  reducers: {
    addConversationDetails: (state, action) => {
      const newConversationDetails = action.payload;
      state.conversationDetails[newConversationDetails._id] =
        newConversationDetails;
    },
    updateConversationLangPrefs: (state, action) => {
      const { langPrefs, userId, chatId } = action.payload;
      const conversation = state.conversationDetails[chatId];
      const member = conversation.members.find(
        (member) => member._id === userId
      );
      member!.type_in_lang = langPrefs.type_in_lang;
      member!.receive_in_lang = langPrefs.receive_in_lang;
    },
    removeConversationDetails: (state) => {
      state.conversationDetails = {};
    },
  },
});

export const {
  addConversationDetails,
  updateConversationLangPrefs,
  removeConversationDetails,
} = conversationDetailsSlice.actions;
export default conversationDetailsSlice.reducer;
