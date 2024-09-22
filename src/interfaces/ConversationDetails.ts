import { UserDetailsAndPrefs } from "@/types/UserDetailsAndPrefs";

export interface ConversationDetails {
  _id: string;
  members: UserDetailsAndPrefs[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
