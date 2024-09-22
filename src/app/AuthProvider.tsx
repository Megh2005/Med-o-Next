"use client";

import { removeConversationDetails } from "@/lib/features/conversationDetails/conversationDetailsSlice";
import { resetConversationConfig } from "@/lib/features/conversations/conversationsConfigSlice";
import { removeConversations } from "@/lib/features/conversations/conversationsSlice";
import { resetInvitationConfig } from "@/lib/features/invitation/invitationConfigSlice";
import { removeInvitations } from "@/lib/features/invitation/invitationSlice";
import { resetUserConfig } from "@/lib/features/user/userConfig";
import { removeUser, setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { auth } from "@/services/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatcher = useAppDispatch();

  function resetState() {
    dispatcher(removeUser());
    dispatcher(resetUserConfig());
    dispatcher(removeConversationDetails());
    dispatcher(removeConversations());
    dispatcher(resetConversationConfig());
    dispatcher(removeInvitations());
    dispatcher(resetInvitationConfig());
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatcher(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
        router.replace("/chats");
      } else {
        resetState();
        router.replace("/login");
      }
    });
  }, [router, dispatcher]);

  return <>{children}</>;
}
