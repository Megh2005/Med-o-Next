"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { LoaderCircle, Send } from "lucide-react";
import axios from "axios";
import { UserInfo } from "@/lib/features/user/userSlice";
import { User } from "@/models/user.model";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UserDetailsAndPrefs } from "@/types/UserDetailsAndPrefs";
import toast from "react-hot-toast";
import { CustomMessage } from "./MessagesContainer";
import { clearEditingMessage } from "@/lib/features/conversations/conversationsSlice";

const ChatInput = ({
  sender,
  recipient,
  conversationId,
  setEditingMessage,
}: {
  sender: UserInfo | null;
  recipient: User;
  conversationId: string;
  setEditingMessage: (message: CustomMessage | null) => void;
}) => {
  const [message, setMessage] = useState("");
  const [enterPressed, setEnterPressed] = useState(false);
  const { conversationDetails } = useAppSelector(
    (state) => state.conversationDetails
  );
  const editingMessage = useAppSelector((state) => state.conversations.editingMessage);
  const [sending, setSending] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dispatcher = useAppDispatch();

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      textAreaRef.current?.focus();
    }
  }, [editingMessage]);

  const { source_lang, target_lang } = useMemo(() => {
    if (!conversationDetails[conversationId])
      return { source_lang: "", target_lang: "" };

    const { type_in_lang } = conversationDetails[conversationId].members.find(
      (member) => member._id === sender?.uid
    ) as UserDetailsAndPrefs;

    const { receive_in_lang } = conversationDetails[
      conversationId
    ].members.find(
      (member) => member._id === recipient._id
    ) as UserDetailsAndPrefs;

    return { source_lang: type_in_lang, target_lang: receive_in_lang };
  }, [conversationDetails]);

  const sendMessage = async () => {
    if (!message) return;
    setSending(true);

    try {
      if (editingMessage) {
        const response = await axios.put(
          "/api/edit-message",
          {
            messageId: editingMessage._id,
            content: message,
            conversationId,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.success) {
          setMessage("");
          dispatcher(clearEditingMessage());
        }
      } else {
        const response = await axios.post(
          "/api/send-message",
          {
            sender: sender?.uid,
            recipient: recipient._id,
            content: message,
            conversationId,
            source_lang,
            target_lang,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.success) {
          setMessage("");
        }
      }
    } catch (error) {
      console.log(error);
      
      toast.error("Error sending message", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !enterPressed) {
        event.preventDefault();
        setEnterPressed(true);
        document.getElementById("sendMessageButton")?.click();

        setTimeout(() => {
          setEnterPressed(false);
        }, 100);
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [enterPressed]);

  return (
    <div className="sticky bottom-0 flex items-center gap-2 border-t bg-card p-2 md:p-4">
      <Textarea
        ref={textAreaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
        className="h-10 flex-1 resize-none rounded-2xl border-none bg-muted px-4 text-sm focus:outline-none focus:ring-0"
      />
      <Button
        onClick={sendMessage}
        variant="ghost"
        size="icon"
        className="rounded-full"
        id="sendMessageButton"
      >
        {sending ? (
          <LoaderCircle className="animate-spin w-6 h-6 text-primary" />
        ) : (
          <Send className="w-6 h-6 text-primary" />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
