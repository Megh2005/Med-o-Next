import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
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
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({ where: { googleId: userId } });


    if (!user) {
      return Response.json(new ApiError(500, "Error user not found"), {
        status: 500,
      });
    }

    const userPref = await prisma.userPref.findFirst({
      where: {
        conversationId: chatId,
        userId: user.id

      }
    })
    if (!userPref) {
      throw new ApiError(400, "userPref not found");
    }



    const updateduserPref = await prisma.userPref.update({
      where: {
        id: userPref.id,
      },
      data: {
        receive_in_lang,
        type_in_lang,
      }
    })


    if (!updateduserPref) {
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
        updateduserPref
      ),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
