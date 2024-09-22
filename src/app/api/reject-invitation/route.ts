import { connectDB } from "@/lib/db";
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

    const response = await InvitationModel.deleteOne({ sender, recipient });

    if (!response) {
      return Response.json(new ApiError(500, "Error rejecting invitation"), {
        status: 500,
      });
    }

    return Response.json(new ApiSuccess(200, "Invitation Rejected", response), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
