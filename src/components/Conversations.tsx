"use client";

import axios from "axios";
import ChatUser from "./ChatUser";
import { useCallback, useEffect } from "react";
import { User } from "@/models/user.model";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addConversation,
  setConversations,
} from "@/lib/features/conversations/conversationsSlice";
import {
  setHasMoreConversations,
  setLoading,
} from "@/lib/features/conversations/conversationsConfigSlice";
import { pusherClient } from "@/lib/pusher";
import ChatUserSkeleton from "./ChatUserSkeleton";
import toast from "react-hot-toast";

export interface Conversation {
  _id: string;
  members: [User];
  lastMessageSender: string;
  lastMessageContent: string;
  lastMessageTranslatedContent: string;
  lastMessageCreatedAt: Date;
}

const Conversations = () => {
  const { conversations } = useAppSelector((state) => state.conversations);
  const { hasMoreConversations, loading } = useAppSelector(
    (state) => state.conversationsConfig
  );
  const { info } = useAppSelector((state) => state.user);
  const dispatcher = useAppDispatch();

  const getAllConversations = useCallback(async () => {
    try {
      const response = await axios.get("/api/conversations", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        dispatcher(setConversations(response.data.data));
        dispatcher(setHasMoreConversations(false));
      }
    } catch (error) {
      toast.error("Error getting conversations", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      dispatcher(setLoading(false));
    }
  }, [dispatcher]);

  useEffect(() => {
    if (!info) return;
    pusherClient.subscribe(`conversations-${info.uid}`);

    const handleNewConversation = async (newConversation: Conversation) => {
      dispatcher(addConversation(newConversation));
    };

    pusherClient.bind("new-conversation", handleNewConversation);

    return () => {
      pusherClient.unsubscribe(`conversations-${info.uid}`);
      pusherClient.unbind("new-conversation", handleNewConversation);
    };
  }, [info]);

  useEffect(() => {
    if (!info) return;
    if (!hasMoreConversations) return;
    getAllConversations();
  }, [getAllConversations, hasMoreConversations, info]);

  return (
    <div className="flex-1 flex flex-col mt-6 gap-4">
      {loading ? (
        <div className="max-w-[400px]">
          <ChatUserSkeleton />
          <ChatUserSkeleton />
          <ChatUserSkeleton />
        </div>
      ) : Object.entries(conversations).length === 0 ? (
        <div>
          <p className="text-slate-500 text-base text-balance md:text-lg lg:text-xl text-center mt-16">
            No conversations found. Start by searching for a user to chat with.
          </p>
        </div>
      ) : (
        Object.entries(conversations).map(([, conversation]) => (
          <ChatUser
            key={conversation._id}
            currentUser={info}
            conversation={conversation}
          />
        ))
      )}
    </div>
  );
};

export default Conversations;
