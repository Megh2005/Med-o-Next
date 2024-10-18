
import { pusherServer } from "@/lib/pusher";
import { MessageRequest } from "@/types/MessageRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

export async function POST(req: CustomRequest) {

  try {
    const {
      sender,
      recipient,
      content,
      conversationId,
      source_lang,
      target_lang,
    } = (await req.json()) as MessageRequest;

    if (
      !sender ||
      !recipient ||
      !content ||
      !conversationId ||
      !source_lang ||
      !target_lang
    ) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const senderUser = await prisma.user.findUnique({ where: { googleId: sender } });
    const recipientUser = await prisma.user.findUnique({ where: { googleId: recipient } });

    if (!senderUser || !recipientUser) {
      return Response.json(new ApiError(400, "Invalid ids"), {
        status: 400,
      });
    }

    let translated_content = content;

    if (source_lang !== target_lang) {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY!
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Translate the following text from ${source_lang} to ${target_lang} and only include the translated text: ${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      translated_content = text;
    }



    const createdMessage = await prisma.message.create({
      data: {
        senderId: senderUser.id,
        recipientId: recipientUser.id,
        content,
        conversationId,
        translated_content,
      },
      include: {
        recipient: true,
        sender: true,
      }
    })

    if (!createdMessage) {
      return Response.json(new ApiError(500, "Failed to send message"));
    }

    const newMessage = {
      _id: createdMessage.id,
      content: createdMessage.content,
      translated_content: createdMessage.translated_content,
      createdAt: createdMessage.createdAt,
      updatedAt: createdMessage.updatedAt,
      sender: {
        _id: createdMessage.sender.googleId,
        email: createdMessage.sender.email,
        displayName: createdMessage.sender.name,
        photoURL: createdMessage.sender.photoURL,
        createdAt: createdMessage.sender.createdAt,
        updatedAt: createdMessage.sender.updatedAt,
      },
      recipient: {
        _id: createdMessage.recipient.googleId,
        email: createdMessage.recipient.email,
        displayName: createdMessage.recipient.name,
        photoURL: createdMessage.recipient.photoURL,
        createdAt: createdMessage.recipient.createdAt,
        updatedAt: createdMessage.recipient.updatedAt,
      },
    };

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageSender: senderUser.id,
        lastMessageContent: content,
        lastMessageTranslatedContent: translated_content,
        lastMessageCreatedAt: new Date(),
      }
    })


    await pusherServer.trigger(
      `messages-${conversationId}`,
      "new-message",
      newMessage
    );

    return Response.json(
      new ApiSuccess(201, "Message sent successfully", newMessage),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
