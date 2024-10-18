import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function GET(req: CustomRequest) {
  await connectDB();

  try {
    const { pathname } = new URL(req.url);
    const chatId = pathname.split("/")[3];
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    if (!chatId) {
      return Response.json(new ApiError(400, "Chat ID is required"), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { googleId: userId } });


    if (!user) {
      return Response.json(new ApiError(500, "Error user not found"), {
        status: 500,
      });
    }

    const chatDetails = await prisma.conversation.findUnique({
      where: { id: chatId }, // Assuming 'id' is the unique identifier for the conversation
      include: {
        members: {
          include: {
            user: true, // Assuming the member has a relation to the User model
          },
        },
      },
    });

    if (!chatDetails) {
      return Response.json(new ApiError(404, "Chat not found"), {
        status: 404,
      });
    }
    const transformedChatDetails = {
      _id: chatDetails.id, // Adjust according to your schema
      members: chatDetails.members.map(member => ({
        _id: member.user.googleId, // Adjust according to your schema
        type_in_lang: member.type_in_lang, // Assuming you have this in your member model
        receive_in_lang: member.receive_in_lang, // Assuming you have this in your member model
        email: member.user.email,
        displayName: member.user.name,
        photoURL: member.user.photoURL,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt,
      })),
      translated_content: chatDetails.lastMessageTranslatedContent,
      lastMessageAt: chatDetails.lastMessageCreatedAt, // Adjust according to your schema
      createdAt: chatDetails.createdAt,
      updatedAt: chatDetails.updatedAt,
    };

    return Response.json(
      new ApiSuccess(200, "Chat Details fetched successfully", transformedChatDetails),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
