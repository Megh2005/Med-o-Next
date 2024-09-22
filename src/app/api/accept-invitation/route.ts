import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ConversationModel } from "@/models/conversation.model";
import { InvitationModel } from "@/models/invitation.model";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function POST(req: CustomRequest) {
  await connectDB();

  try {
    const { sender, recipient } = (await req.json()) as InvitationRequest;

    if (!sender || !recipient) {
      return Response.json(
        new ApiError(400, "Sender and receiver is required"),
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const updatedInvitation = await InvitationModel.findOneAndUpdate(
      { sender, recipient },
      { status: "accepted" }
    );

    if (!updatedInvitation) {
      return Response.json(new ApiError(500, "Error accepting invitation"), {
        status: 500,
      });
    }

    const newConversation = await ConversationModel.create({
      members: [{ _id: sender }, { _id: recipient }],
      lastMessageSender: "",
      lastMessageContent: "",
      lastMessageTranslatedContent: "",
    });

    if (!newConversation) {
      return Response.json(new ApiError(500, "Error creating conversation"), {
        status: 500,
      });
    }

    const conversationNotification = await ConversationModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(newConversation._id) },
      },
      {
        $unwind: "$members",
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

    pusherServer.trigger(
      `conversations-${newConversation.members[0]._id}`,
      "new-conversation",
      conversationNotification[0]
    );
    pusherServer.trigger(
      `conversations-${newConversation.members[1]._id}`,
      "new-conversation",
      conversationNotification[0]
    );

    await session.commitTransaction();

    return Response.json(
      new ApiSuccess(200, "Conversation created", newConversation),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
