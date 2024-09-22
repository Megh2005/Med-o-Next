import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { InvitationModel } from "@/models/invitation.model";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

// create a new invitation
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

    const newInvitation = new InvitationModel({
      sender,
      recipient,
      status: "pending",
    });

    const createdInvitation = await newInvitation.save();

    if (!createdInvitation) {
      return Response.json(new ApiError(500, "Error creating invitation"), {
        status: 500,
      });
    }

    const invitationNotification = await InvitationModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(createdInvitation._id as string),
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
        $unwind: "$recipient",
      },
      {
        $unwind: "$sender",
      },
    ]);

    pusherServer.trigger(
      `invitations-${createdInvitation.recipient}`,
      "new-invitation",
      invitationNotification[0]
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
  await connectDB();

  try {
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    const invitations = await InvitationModel.aggregate([
      {
        $match: { recipient: userId, status: "pending" },
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
        $unwind: "$sender",
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    console.log(invitations);

    return Response.json(new ApiSuccess(200, "Invitations", invitations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
