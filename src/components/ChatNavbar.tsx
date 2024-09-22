"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, UserRound } from "lucide-react";
import ChatLangPrefs from "@/components/ChatLangPrefs";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

const ChatNavbar = ({
  otherMember,
  chatId,
}: {
  otherMember: any;
  chatId: string;
}) => {
  const { info } = useAppSelector((state) => state.user);
  const { conversationDetails } = useAppSelector(
    (store) => store.conversationDetails
  );
  const navigate = useRouter();

  return (
    <div className="z-50 sticky top-0 flex items-center justify-between border-b bg-card px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center gap-3">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate.back()} />
        <Avatar>
          <AvatarImage src={otherMember?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{otherMember?.displayName}</div>
      </div>
      {conversationDetails[chatId] && (
        <ChatLangPrefs conversationId={chatId} currentUser={info} />
      )}
    </div>
  );
};

export default ChatNavbar;
