import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { MessageModel } from "@/models/message.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function PUT(req: CustomRequest) {
  await connectDB();

  try {
    const { messageId, content, conversationId } = await req.json();

    if (!messageId || !content || !conversationId) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return Response.json(new ApiError(404, "Message not found"), {
        status: 404,
      });
    }

    message.content = content;
    message.translated_content = content;
    const updatedMessage = await message.save();

    if (!updatedMessage) {
      return Response.json(new ApiError(500, "Failed to update message"), {
        status: 500,
      });
    }

    const newMessage = await MessageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(updatedMessage._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $unwind: "$recipient",
      },
    ]);

    await pusherServer.trigger(
      `messages-${conversationId}`,
      "message-edited",
      newMessage[0]
    );

    return Response.json(
      new ApiSuccess(200, "Message updated successfully", updatedMessage),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
