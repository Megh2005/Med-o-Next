import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
import { ConversationModel } from "@/models/conversation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function GET(req: CustomRequest) {
  await connectDB();

  try {
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


    const allConversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId: user.id }, // Adjust according to your schema
        },
      },
      include: {
        members: {
          include: {
            user: true, // Assuming user contains user details like email, displayName, etc.
          },
        },
      },
    });

    // Transforming the result to match the expected output format
    const transformedConversations = allConversations.map(conversation => ({
      _id: conversation.id, // Adjust according to your schema
      members: conversation.members.map(member => ({
        _id: member.user.googleId, // Adjust according to your schema
        email: member.user.email,
        displayName: member.user.name,
        photoURL: member.user.photoURL,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt,
      })),
      lastMessageSender: conversation.lastMessageSender,
      lastMessageContent: conversation.lastMessageContent,
      lastMessageTranslatedContent: conversation.lastMessageTranslatedContent,
      lastMessageCreatedAt: conversation.lastMessageCreatedAt,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }));

    return Response.json(new ApiSuccess(200, "Invitations", transformedConversations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
