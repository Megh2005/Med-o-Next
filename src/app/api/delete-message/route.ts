
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function DELETE(req: CustomRequest) {

  try {
    const { messageId, conversationId } = await req.json();

    if (!messageId || !conversationId) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const message = await prisma.message.findUnique({ where: { id: messageId } })

    if (!message) {
      return Response.json(new ApiError(404, "Message not found"), {
        status: 404,
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: "This message has been deleted",
        translated_content: "This message has been deleted"
      },
      include: {
        sender: true,
        recipient: true,
      }
    })

    if (!updatedMessage) {
      return Response.json(new ApiError(500, "Failed to delete message"), {
        status: 500,
      });
    }

    const newMessage = {
      _id: updatedMessage.id,
      content: updatedMessage.content,
      translated_content: updatedMessage.translated_content,
      createdAt: updatedMessage.createdAt,
      updatedAt: updatedMessage.updatedAt,
      sender: {
        _id: updatedMessage.sender.googleId,
        email: updatedMessage.sender.email,
        displayName: updatedMessage.sender.name,
        photoURL: updatedMessage.sender.photoURL,
        createdAt: updatedMessage.sender.createdAt,
        updatedAt: updatedMessage.sender.updatedAt,
      },
      recipient: {
        _id: updatedMessage.recipient.googleId,
        email: updatedMessage.recipient.email,
        displayName: updatedMessage.recipient.name,
        photoURL: updatedMessage.recipient.photoURL,
        createdAt: updatedMessage.recipient.createdAt,
        updatedAt: updatedMessage.recipient.updatedAt,
      },
    };

    await pusherServer.trigger(
      `messages-${conversationId}`,
      "message-deleted",
      newMessage
    );

    return Response.json(
      new ApiSuccess(200, "Message deleted successfully", updatedMessage),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
