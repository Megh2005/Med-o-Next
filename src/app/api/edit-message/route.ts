import { connectDB } from "@/lib/db";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { MessageModel } from "@/models/message.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function PUT(req: CustomRequest) {


  try {
    const { messageId, content, conversationId } = await req.json();

    if (!messageId || !content || !conversationId) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }


    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
        translated_content: content
      },
      include: {
        recipient: true,
        sender: true,
      }
    })

    if (!updatedMessage) {
      return Response.json(new ApiError(500, "Failed to update message"), {
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
      "message-edited",
      newMessage
    );

    return Response.json(
      new ApiSuccess(200, "Message updated successfully", updatedMessage),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
