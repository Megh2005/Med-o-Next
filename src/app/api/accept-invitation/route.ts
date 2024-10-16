
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
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
      where: { senderId: senderUser.id, recipientId: recipientUser.id }
    })

    if (!invitation) {
      return Response.json(new ApiError(404, "invitation not found"), {
        status: 404,
      });
    }


    const [updatedInvitation, newConversation] = await prisma.$transaction([
      prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: 'accepted'
        }
      }),
      prisma.conversation.create({
        data: {
          members: {
            create: [
              {
                userId: senderUser.id,
                type_in_lang: "english",
                receive_in_lang: "english",
              }, {
                userId: recipientUser.id,
                type_in_lang: "english",
                receive_in_lang: "english",
              },
            ]
          },
          lastMessageContent: "",
          lastMessageTranslatedContent: "",
        },

        select: {
          id: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  googleId: true,
                  photoURL: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },

          lastMessageContent: true,
          lastMessageTranslatedContent: true,
          lastMessageSender: true,
          lastMessageCreatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    ])


    // Restructure to match Mongoose output
    const result = {
      _id: newConversation.id,
      members: newConversation.members.map((member) => ({
        _id: member.user.googleId,
        email: member.user.email,
        displayName: member.user.name,
        photoURL: member.user.photoURL,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt,
      })),
      lastMessageSender: newConversation.lastMessageSender,
      lastMessageContent: newConversation.lastMessageContent,
      lastMessageTranslatedContent: newConversation.lastMessageTranslatedContent,
      lastMessageCreatedAt: newConversation.lastMessageCreatedAt,
      createdAt: newConversation.createdAt,
      updatedAt: newConversation.updatedAt,
    };

    console.log(result)
    pusherServer.trigger(
      `conversations-${newConversation.members[0].user.googleId}`,
      "new-conversation",
      result
    );
    pusherServer.trigger(
      `conversations-${newConversation.members[1].user.googleId}`,
      "new-conversation",
      result
    );


    return Response.json(
      new ApiSuccess(200, "Conversation created", result),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
