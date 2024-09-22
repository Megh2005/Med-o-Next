import { connectDB } from "@/lib/db";
import { ConversationModel } from "@/models/conversation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

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

    const chatDetails = await ConversationModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chatId) },
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
              _id: "$members._id",
              type_in_lang: "$members.type_in_lang",
              receive_in_lang: "$members.receive_in_lang",
              email: "$memberDetails.email",
              displayName: "$memberDetails.displayName",
              photoURL: "$memberDetails.photoURL",
              createdAt: "$memberDetails.createdAt",
              updatedAt: "$memberDetails.updatedAt",
            },
          },
          lastMessageAt: { $first: "$lastMessageAt" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ]);

    if (!chatDetails) {
      return Response.json(new ApiError(404, "Chat not found"), {
        status: 404,
      });
    }

    return Response.json(
      new ApiSuccess(200, "Chat Details fetched successfully", chatDetails[0]),
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
