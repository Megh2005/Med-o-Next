import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { InvitationModel } from "@/models/invitation.model";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

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
    const senderUser = await prisma.user.findUnique({ where: { googleId: sender } });
    const recipientUser = await prisma.user.findUnique({ where: { googleId: recipient } });

    if (!senderUser || !recipientUser) {
      return Response.json(new ApiError(400, "Invalid ids"), {
        status: 400,
      });
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        recipientId: recipientUser.id,
        senderId: recipientUser.id,
      }
    })

    if (!invitation) {
      return Response.json(new ApiError(500, "Error cancelling invitation"), {
        status: 500,
      });
    }

    await prisma.invitation.delete({
      where: {
        id: invitation.id,
      }
    })

    const deletedInvitation = await InvitationModel.findOneAndDelete({
      sender,
      recipient,
    });

    if (!deletedInvitation) {
      return Response.json(new ApiError(500, "Error cancelling invitation"), {
        status: 500,
      });
    }

    pusherServer.trigger(
      `cancel-invitation-${deletedInvitation.recipient}`,
      "cancel-invitation",
      deletedInvitation
    );

    return Response.json(new ApiSuccess(200, "Invitation cancelled", null), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
