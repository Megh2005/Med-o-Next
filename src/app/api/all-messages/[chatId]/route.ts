import { connectDB } from "@/lib/db";
import { MessageModel } from "@/models/message.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function GET(req: CustomRequest) {
  await connectDB();

  try {
    const { pathname, searchParams } = new URL(req.url);
    const chatId = pathname.split("/")[3];
    const userId = req.headers.get("userId");
    const page = parseInt(searchParams.get("page")!) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")!) || 10;

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

    const messages = await MessageModel.aggregate([
      { $match: { conversationId: new mongoose.Types.ObjectId(chatId) } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $sort: { createdAt: -1 } },
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
          ],
        },
      },
      {
        $project: {
          data: 1,
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$metadata.totalCount", 0] }, 0],
          },
        },
      },
    ]);

    return Response.json(
      new ApiSuccess(200, "Messages retrieved", {
        messages: messages[0].data,
        metadata: {
          totalCount: messages[0].totalCount,
          page,
          pageSize,
          hasNextPage: messages[0].totalCount - page * pageSize > 0,
        },
      }),
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
