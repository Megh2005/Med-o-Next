import { pusherClient } from "@/lib/pusher";
import { updateConversationLangPrefs } from "@/lib/features/conversationDetails/conversationDetailsSlice";
import { useEffect } from "react";

const useLangPrefsUpdate = ({
  dispatcher,
  conversationId,
}: {
  dispatcher: any;
  conversationId: string;
}) => {
  useEffect(() => {
    if (!conversationId) return;

    pusherClient.subscribe(`update-lang-prefs-${conversationId}`);

    const handleLangPrefsUpdate = (data: any) => {
      dispatcher(
        updateConversationLangPrefs({
          chatId: conversationId,
          userId: data.userId,
          langPrefs: data.langPrefs,
        })
      );
    };

    pusherClient.bind("update-lang-prefs", handleLangPrefsUpdate);

    return () => {
      pusherClient.unsubscribe(`update-lang-prefs-${conversationId}`);
      pusherClient.unbind("update-lang-prefs", handleLangPrefsUpdate);
    };
  }, [conversationId]);
};

export default useLangPrefsUpdate;
