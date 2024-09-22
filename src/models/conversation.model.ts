import mongoose, { Schema } from "mongoose";

export interface LastMessage {
  lastMessageContent: string;
  lastMessageSender: string;
  lastMessageTranslatedContent: string;
  lastMessageCreatedAt: Date;
}

interface Conversation {
  members: UserPref[];
  lastMessageSender: string;
  lastMessageContent: string;
  lastMessageTranslatedContent: string;
  lastMessageCreatedAt?: Date;
}

interface UserPref {
  _id: string;
  type_in_lang: string;
  receive_in_lang: string;
}

const userPrefSchema: Schema<UserPref> = new Schema<UserPref>(
  {
    _id: { type: Schema.Types.String, ref: "User", required: true },
    type_in_lang: { type: String, required: true, default: "english" },
    receive_in_lang: { type: String, required: true, default: "english" },
  },
  { _id: false }
);

const conversationSchema: Schema<Conversation> = new Schema<Conversation>(
  {
    members: { type: [userPrefSchema], required: true },
    lastMessageContent: { type: String, default: "" },
    lastMessageSender: { type: Schema.Types.String, ref: "User" },
    lastMessageTranslatedContent: { type: String, default: "" },
    lastMessageCreatedAt: { type: Date },
  },
  { timestamps: true }
);

export const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model("Conversation", conversationSchema);
