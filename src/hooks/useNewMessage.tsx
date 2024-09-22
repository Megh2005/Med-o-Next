import { CustomMessage } from "@/components/MessagesContainer";
import { pusherClient } from "@/lib/pusher";
import { useEffect } from "react";

const useNewMessage = ({
  conversationId,
  handler,
}: {
  conversationId: string;
  handler: (newMessage: CustomMessage) => Promise<void>;
}) => {
  useEffect(() => {
    if (!conversationId) return;
    pusherClient.subscribe(`messages-${conversationId}`);

    const handleIncomingMessage = handler;

    pusherClient.bind("new-message", handleIncomingMessage);

    return () => {
      pusherClient.unsubscribe(`messages-${conversationId}`);
      pusherClient.unbind("new-message", handleIncomingMessage);
    };
  }, [conversationId]);
};

export default useNewMessage;
