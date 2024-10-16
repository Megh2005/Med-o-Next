import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
import { UserModel } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";

export async function GET(req: Request, res: Response) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const userId = req.headers.get("userId");
    const searchQuery = url.searchParams.get("q");
    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    if (!searchQuery) {
      return Response.json(new ApiError(400, "Missing search query"), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { googleId: userId } })
    // search for users

    // const searchResult = await UserModel.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         {
    //           $or: [
    //             { displayName: { $regex: searchQuery, $options: "i" } },
    //             { email: { $regex: searchQuery, $options: "i" } },
    //           ],
    //         },
    //         { _id: { $ne: userId } },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "invitations",
    //       let: { userId: "$_id", currentUserId: userId },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$sender", "$$userId"] },
    //                 { $eq: ["$recipient", "$$currentUserId"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "invitations",
    //     },
    //   },
    //   {
    //     $match: {
    //       invitations: { $eq: [] },
    //     },
    //   },
    //   {
    //     $project: {
    //       invitations: 0,
    //     },
    //   },
    // ]);

    const searchResult = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { email: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
          {
            id: { not: user?.id },
          },
          {
            sentInvitations: {
              none: {
                recipientId: user?.id,
              },
            },
          },
        ],
      }
    })

    const queryTransform = searchResult.map((user) => ({
      _id: user.googleId,
      displayName: user.name,
      email: user.email,
      photoURL: user.photoURL,
      updatedAt: user.updatedAt,
    }))


    return Response.json(new ApiSuccess(200, "Search results", queryTransform), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
