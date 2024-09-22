import mongoose, { Model, Schema } from "mongoose";

export interface Message {
  conversationId: Schema.Types.ObjectId;
  content: string;
  translated_content: string;
  sender: string;
  recipient: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema<Message>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    translated_content: {
      type: String,
      default: "",
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    recipient: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const MessageModel =
  (mongoose.models.Message as Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);
