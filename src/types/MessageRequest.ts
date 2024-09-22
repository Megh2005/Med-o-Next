export type MessageRequest = {
  conversationId: string;
  sender: string;
  recipient: string;
  content: string;
  source_lang: string;
  target_lang: string;
};
