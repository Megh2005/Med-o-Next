import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ConversationModel } from "@/models/conversation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

type UpdateLangPrefsRequest = {
  chatId: string;
  receive_in_lang: string;
  type_in_lang: string;
};

export async function POST(req: CustomRequest) {
  await connectDB();

  try {
    const { chatId, receive_in_lang, type_in_lang } =
      (await req.json()) as UpdateLangPrefsRequest;

    if (!chatId || !receive_in_lang || !type_in_lang) {
      throw new ApiError(
        400,
        "Chat ID, receive_in_lang and type_in_lang are required"
      );
    }

    const conversation = await ConversationModel.findById(chatId);

    if (!conversation) {
      throw new ApiError(400, "Conversation not found");
    }

    const member = conversation.members.find(
      (member) => member._id.toString() === req.headers.get("userId")
    );

    if (!member) {
      throw new ApiError(400, "User not found in conversation");
    }

    member.receive_in_lang = receive_in_lang;
    member.type_in_lang = type_in_lang;

    const updatedConversation = await conversation.save();

    if (!updatedConversation) {
      throw new ApiError(400, "Lang prefs update failed");
    }

    pusherServer.trigger(`update-lang-prefs-${chatId}`, "update-lang-prefs", {
      userId: req.headers.get("userId"),
      langPrefs: { receive_in_lang, type_in_lang },
    });

    return Response.json(
      new ApiSuccess(
        200,
        "Lang prefs updated successfully",
        updatedConversation
      ),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
