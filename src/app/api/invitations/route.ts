
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

// create a new invitation
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


    const createdInvitation = await prisma.invitation.create({
      data: {
        recipientId: recipientUser.id,
        senderId: senderUser.id,
        status: 'pending',

      },
      include: {
        sender: true,
        recipient: true
      }
    })

    if (!createdInvitation) {
      return Response.json(new ApiError(500, "Error creating invitation"), {
        status: 500,
      });
    }


    const transformedInvitation = {
      _id: createdInvitation.id,
      sender: {
        _id: createdInvitation.sender.googleId, // Use googleId as the _id for sender
        email: createdInvitation.sender.email,
        displayName: createdInvitation.sender.name, // Map `name` to `displayName`
        photoURL: createdInvitation.sender.photoURL,
        createdAt: createdInvitation.sender.createdAt,
        updatedAt: createdInvitation.sender.updatedAt,
      },
      recipient: {
        _id: createdInvitation.recipient.googleId, // Use googleId as the _id for recipient
        email: createdInvitation.recipient.email,
        displayName: createdInvitation.recipient.name, // Map `name` to `displayName`
        photoURL: createdInvitation.recipient.photoURL,
        createdAt: createdInvitation.recipient.createdAt,
        updatedAt: createdInvitation.recipient.updatedAt,
      },
      status: createdInvitation.status,
      createdAt: createdInvitation.createdAt,
      updatedAt: createdInvitation.updatedAt,
    };



    pusherServer.trigger(
      `invitations-${transformedInvitation.recipient._id}`,
      "new-invitation",
      transformedInvitation
    );

    return Response.json(
      new ApiSuccess(201, "Invitation Created", createdInvitation),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function GET(req: CustomRequest) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({ where: { googleId: userId } });

    if (!user) {
      return Response.json(new ApiError(404, "User not found"), {
        status: 404,
      });
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        recipientId: user.id,
        status: 'pending',
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    const transformedInvitations = invitations.map((invitation) => ({
      _id: invitation.id,
      createdAt: invitation.createdAt,
      recipient: user.googleId,
      status: invitation.status,
      updatedAt: invitation.updatedAt,
      sender: {
        _id: invitation.sender.googleId,
        email: invitation.sender.email,
        displayName: invitation.sender.name,
        photoURL: invitation.sender.photoURL,
      }

    }))


    return Response.json(new ApiSuccess(200, "Invitations", transformedInvitations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
