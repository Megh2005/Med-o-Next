
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
export async function GET(req: CustomRequest) {

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
    const user = await prisma.user.findUnique({ where: { googleId: userId } });


    if (!user) {
      return Response.json(new ApiError(500, "Error user not found"), {
        status: 500,
      });
    }

    // const messages = await MessageModel.aggregate([
    //   { $match: { conversationId: new mongoose.Types.ObjectId(chatId) } },
    //   { $sort: { createdAt: -1 } },
    //   {
    //     $facet: {
    //       metadata: [{ $count: "totalCount" }],
    //       data: [
    //         { $skip: (page - 1) * pageSize },
    //         { $limit: pageSize },
    //         { $sort: { createdAt: -1 } },
    //         {
    //           $lookup: {
    //             from: "users",
    //             localField: "sender",
    //             foreignField: "_id",
    //             as: "sender",
    //           },
    //         },
    //         {
    //           $lookup: {
    //             from: "users",
    //             localField: "recipient",
    //             foreignField: "_id",
    //             as: "recipient",
    //           },
    //         },
    //         {
    //           $unwind: "$sender",
    //         },
    //         {
    //           $unwind: "$recipient",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       data: 1,
    //       totalCount: {
    //         $ifNull: [{ $arrayElemAt: ["$metadata.totalCount", 0] }, 0],
    //       },
    //     },
    //   },
    // ]);



    const messagesData = await prisma.message.findMany({
      where: { conversationId: chatId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        recipient: true,
        sender: true,
        Conversation: {
          include: {
            members: {
              include: {
                user: true
              }
            },

          },

        }
      },
    });




    const totalCount = await prisma.message.count({
      where: {
        conversationId: chatId,
      },
    });

    const messages = messagesData.map(message => ({
      _id: message.id,
      content: message.content, // Assuming 'content' is a field in your message model
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      translated_content: message.translated_content,
      sender: {
        _id: message.sender.googleId,
        email: message.sender.email,
        displayName: message.sender.name,
        photoURL: message.sender.photoURL,
        createdAt: message.sender.createdAt,
        updatedAt: message.sender.updatedAt,
      }, // Assuming sender's details are available directly
      recipient: {
        _id: message.recipient.googleId,
        email: message.recipient.email,
        displayName: message.recipient.name,
        photoURL: message.recipient.photoURL,
        createdAt: message.recipient.createdAt,
        updatedAt: message.recipient.updatedAt,
      }, // Assuming recipient's details are available directly
      conversationId: message.Conversation.id,
      conversation: {
        _id: message.Conversation.id,
        members: message.Conversation.members.map(member => ({
          _id: member.user.googleId,
          email: member.user.email,
          displayName: member.user.name,
          photoURL: member.user.photoURL,
          createdAt: member.user.createdAt,
          updatedAt: member.user.updatedAt,
        })),
      },
    }))

    const metadata = {
      totalCount: totalCount,
      page,
      pageSize,
      hasNextPage: totalCount - page * pageSize > 0,
    };
    return Response.json(
      new ApiSuccess(200, "Messages retrieved", {
        messages,
        metadata,
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
