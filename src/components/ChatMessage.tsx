import { Pencil, Trash, UserRound } from "lucide-react";
import { CustomMessage } from "./MessagesContainer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatMongoDate } from "@/utils/ConvertMongoDate";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import { setEditingMessage, updateLastMessage } from "@/lib/features/conversations/conversationsSlice";
import { LastMessage } from "@/models/conversation.model";

const ChatMessage = ({
  message,
}: {
  message: CustomMessage;
}) => {
  const { info } = useAppSelector((state) => state.user);
  const [isDeleted, setIsDeleted] = useState(false);
  const dispatcher = useAppDispatch();
  const conversationId = message.conversationId;

  const deleteMessage = async () => {
    try {
      const response = await fetch("/api/delete-message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message._id,
          conversationId: message.conversationId,
        }),
      });

      if (response.ok) {
        setIsDeleted(true);
        const lastMessage: LastMessage = {
          lastMessageSender: message.sender._id.toString(),
          lastMessageContent: "This message has been deleted",
          lastMessageTranslatedContent: "This message has been deleted",
          lastMessageCreatedAt: message.createdAt,
        };
        dispatcher(updateLastMessage({lastMessage, conversationId}));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const editMessage = () => {
    dispatcher(setEditingMessage(message));
  };

  return (
    <div
      className={`animate-bounceIn flex items-start gap-2 md:gap-3 ${
        message.sender._id === info?.uid && "justify-end" && "flex-row-reverse"
      }`}
    >
      <div>
        <Avatar className="border">
          <AvatarImage src={message?.sender.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="p-2">
          {message?.sender._id === info?.uid && (
            <Trash onClick={deleteMessage} className="cursor-pointer" />
          )}
          {message?.sender._id === info?.uid && (
            <Pencil onClick={editMessage} className="cursor-pointer" />
          )}
        </div>
      </div>
      <div
        className={`${
          message.sender._id === info?.uid ? "bg-primary" : "bg-muted"
        } rounded-lg p-3 max-w-[70%]`}
      >
        <div
          className={`${
            message.sender._id === info?.uid
              ? "text-primary-foreground"
              : "text-black"
          }`}
        >
          {message.sender._id === info?.uid
            ? isDeleted
              ? "This message has been deleted"
              : message?.content
            : isDeleted
            ? "This message has been deleted"
            : message?.translated_content}
        </div>
        <div
          className={`${
            message.sender._id === info?.uid
              ? "text-gray-200"
              : "text-muted-foreground"
          } text-xs mt-1`}
        >
          {formatMongoDate(message?.createdAt.toString())}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
