import { connectDB } from "@/lib/db";
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

    const allConversations = await ConversationModel.aggregate([
      {
        $match: { "members._id": userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "members._id",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $unwind: "$memberDetails",
      },
      {
        $group: {
          _id: "$_id",
          members: {
            $push: {
              _id: "$memberDetails._id",
              email: "$memberDetails.email",
              displayName: "$memberDetails.displayName",
              photoURL: "$memberDetails.photoURL",
              createdAt: "$memberDetails.createdAt",
              updatedAt: "$memberDetails.updatedAt",
            },
          },
          lastMessageSender: { $first: "$lastMessageSender" },
          lastMessageContent: { $first: "$lastMessageContent" },
          lastMessageTranslatedContent: {
            $first: "$lastMessageTranslatedContent",
          },
          lastMessageCreatedAt: { $first: "$lastMessageCreatedAt" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 1,
          members: 1,
          lastMessageSender: 1,
          lastMessageContent: 1,
          lastMessageTranslatedContent: 1,
          lastMessageCreatedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return Response.json(new ApiSuccess(200, "Invitations", allConversations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
