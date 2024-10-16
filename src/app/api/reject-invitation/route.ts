
import prisma from "@/lib/prisma";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function POST(req: CustomRequest) {

  try {
    const { sender, recipient } = (await req.json()) as InvitationRequest;

    if (!sender || !recipient) {
      return Response.json(
        new ApiError(400, "Sender and receiver is required"),
        { status: 400 }
      );
    }
    const senderUser = await prisma.user.findUnique({ where: { googleId: sender } });
    const recipientUser = await prisma.user.findUnique({ where: { googleId: recipient } });

    if (!senderUser || !recipientUser) {
      return Response.json(new ApiError(400, "Invalid ids"), {
        status: 400,
      });
    }
    const invitation = await prisma.invitation.findFirst({
      where: {
        senderId: senderUser.id,
        recipientId: recipientUser.id
      }
    })

    if (!invitation) {
      return Response.json(new ApiError(404, "No invitation found"), {
        status: 404,
      });
    }


    await prisma.invitation.delete({ where: { id: invitation.id } })



    return Response.json(new ApiSuccess(200, "Invitation Rejected", {}), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
