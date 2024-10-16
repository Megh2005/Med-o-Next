
import prisma from "@/lib/prisma";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function GET(req: CustomRequest) {


  try {
    const url = new URL(req.url);
    const userId = req.headers.get("userId");
    const recipient = url.searchParams.get("recipient");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    if (!recipient) {
      return Response.json(new ApiError(400, "Missing recipient"), {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({ where: { googleId: userId } });
    const recipientUser = await prisma.user.findUnique({ where: { googleId: recipient } });

    if (!user || !recipientUser) {
      return Response.json(new ApiError(400, "Invalid ids"), {
        status: 400,
      });
    }

    // check if the user has already sent an invitation to the recipient

    const isInvited = await prisma.invitation.findFirst({
      where: {
        senderId: user.id,
        recipientId: recipientUser.id
      }
    })


    if (!isInvited) {
      return Response.json(
        new ApiSuccess(200, "No invitation sent", { inviteStatus: "unsent" }),
        {
          status: 200,
        }
      );
    }

    return Response.json(
      new ApiSuccess(200, "Invitation already sent", {
        inviteStatus: isInvited.status,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
