import { UserRound } from "lucide-react";
import { CustomMessage } from "./MessagesContainer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatMongoDate } from "@/utils/ConvertMongoDate";
import { useAppSelector } from "@/lib/hooks";

const ChatMessage = ({ message }: { message: CustomMessage }) => {
  const { info } = useAppSelector((state) => state.user);

  return (
    <div
      className={`animate-bounceIn flex items-start gap-2 md:gap-3 ${
        message.sender._id === info?.uid && "justify-end" && "flex-row-reverse"
      }`}
    >
      <Avatar className="border">
        <AvatarImage src={message?.sender.photoURL} />
        <AvatarFallback>
          <UserRound />
        </AvatarFallback>
      </Avatar>
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
            ? message?.content
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
