import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { MessageModel } from "@/models/message.model";
import { MessageRequest } from "@/types/MessageRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";
import { ConversationModel } from "@/models/conversation.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: CustomRequest) {
  await connectDB();

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

    const message = new MessageModel({
      sender,
      recipient,
      content,
      conversationId,
      translated_content,
    });

    const createdMessage = await message.save();

    if (!createdMessage) {
      return Response.json(new ApiError(500, "Failed to send message"));
    }

    const newMessage = await MessageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(createdMessage._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $unwind: "$recipient",
      },
    ]);

    await ConversationModel.findOneAndUpdate(
      {
        _id: conversationId,
      },
      {
        lastMessageSender: sender,
        lastMessageContent: content,
        lastMessageTranslatedContent: translated_content,
        lastMessageCreatedAt: new Date(),
      }
    );

    await pusherServer.trigger(
      `messages-${conversationId}`,
      "new-message",
      newMessage[0]
    );

    return Response.json(
      new ApiSuccess(201, "Message sent successfully", createdMessage),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
