"use client";

import { User } from "@/models/user.model";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChatMessage from "./ChatMessage";
import { MESSAGES_PAGE_SIZE } from "@/lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";
import useNewMessage from "@/hooks/useNewMessage";
import { useAppDispatch } from "@/lib/hooks";
import { updateLastMessage } from "@/lib/features/conversations/conversationsSlice";
import { LastMessage } from "@/models/conversation.model";
import toast from "react-hot-toast";

export interface CustomMessage {
  _id: string;
  sender: User;
  recipient: User;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  content: string;
  translated_content: string;
}

const MessagesContainer = ({ conversationId }: { conversationId: string }) => {
  const memoizedConversationId = useMemo(
    () => conversationId,
    [conversationId]
  );

  const dispatcher = useAppDispatch();

  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [page, setPage] = useState<number>(1);

  const memoizedPage = useMemo(() => page, [page]);

  const [shouldScroll, setShouldScroll] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadMessages = async () => {
    if (!memoizedConversationId) return;
    console.log("Has more: ", hasMore);
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/all-messages/${memoizedConversationId}?page=${memoizedPage}&pageSize=${MESSAGES_PAGE_SIZE}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.success) {
        setHasMore(response.data.data.metadata.hasNextPage);
        setPage((prevPage) => prevPage + 1);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.data.messages,
        ]);
        setShouldScroll(false);
      }
    } catch (error) {
      toast.error("Error getting messages", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [messages, shouldScroll]);

  const handleIncomingMessage = async (newMessage: CustomMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);

    const lastMessage: LastMessage = {
      lastMessageSender: newMessage.sender._id.toString(),
      lastMessageContent: newMessage.content,
      lastMessageTranslatedContent: newMessage.translated_content,
      lastMessageCreatedAt: newMessage.createdAt,
    };

    dispatcher(
      updateLastMessage({
        lastMessage,
        conversationId,
      })
    );
    setShouldScroll(true);
  };

  useNewMessage({ conversationId, handler: handleIncomingMessage });

  if (!memoizedConversationId) return null;

  return (
    <div className="flex-1">
      <InfiniteScroll
        scrollThreshold={0.9}
        dataLength={messages.length}
        next={loadMessages}
        hasMore={hasMore}
        loader={
          loading && (
            <div className="flex justify-center">
              <Loader dimensions="w-8 h-8" />
            </div>
          )
        }
      >
        <div className="grid gap-5 px-3 md:px-6 py-4 md:py-8">
          {messages.map((message, index) => {
            const prevMessage = index === 0 ? null : messages[index - 1];
            const showDate =
              !prevMessage ||
              new Date(
                prevMessage.createdAt.toString()
              ).toLocaleDateString() !==
                new Date(message.createdAt.toString()).toLocaleDateString();

            return (
              <React.Fragment key={message._id}>
                {showDate && (
                  <p className="text-center text-xs md:text-sm text-gray-500 font-medium">
                    {new Date(
                      message.createdAt.toString()
                    ).toLocaleDateString()}
                  </p>
                )}
                <div>
                  <ChatMessage message={message} />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MessagesContainer;
