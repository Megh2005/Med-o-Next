import { connectDB } from "@/lib/db";
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

    // search for users

    const searchResult = await UserModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { displayName: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
              ],
            },
            { _id: { $ne: userId } },
          ],
        },
      },
      {
        $lookup: {
          from: "invitations",
          let: { userId: "$_id", currentUserId: userId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sender", "$$userId"] },
                    { $eq: ["$recipient", "$$currentUserId"] },
                  ],
                },
              },
            },
          ],
          as: "invitations",
        },
      },
      {
        $match: {
          invitations: { $eq: [] },
        },
      },
      {
        $project: {
          invitations: 0,
        },
      },
    ]);

    return Response.json(new ApiSuccess(200, "Search results", searchResult), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
