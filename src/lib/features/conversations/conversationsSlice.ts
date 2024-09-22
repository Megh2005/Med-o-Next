import { Conversation } from "@/components/Conversations";
import { LastMessage } from "@/models/conversation.model";
import { createSlice } from "@reduxjs/toolkit";

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: {} as Record<string, Conversation>,
  },
  reducers: {
    setConversations: (state, action) => {
      const conversationsList = action.payload as Array<any>;
      conversationsList.map((conversation) => {
        state.conversations[conversation._id] = conversation;
      });
    },
    addConversation: (state, action) => {
      const newConversation = action.payload;
      state.conversations[newConversation._id] = newConversation;
    },
    removeConversations: (state) => {
      state.conversations = {};
    },
    updateLastMessage: (state, action) => {
      const {
        lastMessage,
        conversationId,
      }: { lastMessage: LastMessage; conversationId: string } = action.payload;
      state.conversations[conversationId].lastMessageContent =
        lastMessage.lastMessageContent;
      state.conversations[conversationId].lastMessageSender =
        lastMessage.lastMessageSender;
      state.conversations[conversationId].lastMessageTranslatedContent =
        lastMessage.lastMessageTranslatedContent;
      state.conversations[conversationId].lastMessageCreatedAt =
        lastMessage.lastMessageCreatedAt;
    },
  },
});

export const {
  setConversations,
  addConversation,
  removeConversations,
  updateLastMessage,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
