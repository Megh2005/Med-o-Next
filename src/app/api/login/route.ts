import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { Document } from "mongoose";
import { SignJWT } from "jose";
import secretKey from "@/utils/encodeJWT";

type CustomRequest = {
  _id?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
};

export async function POST(req: Request) {
  await connectDB();

  try {
    const { _id, email, displayName, photoURL } =
      (await req.json()) as CustomRequest;

    if (!email || !displayName || !_id || !photoURL) {
      return Response.json(new ApiError(400, "Missing required fields"), {
        status: 400,
      });
    }

    const exisitingUser = await UserModel.findOne({ email });

    if (exisitingUser) {
      const token = await new SignJWT({ _id: exisitingUser._id })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);

      return Response.json(
        new ApiSuccess(200, "User already exists", { exisitingUser, token }),
        {
          status: 200,
        }
      );
    }

    // new user, save to db

    const user: Document = new UserModel({
      email,
      displayName,
      _id,
      photoURL,
    });

    const createdUser: Document = await user.save();

    if (!createdUser) {
      return Response.json(new ApiError(500, "Error creating user"), {
        status: 500,
      });
    }

    const token = await new SignJWT({ _id: createdUser._id })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    return Response.json(
      new ApiSuccess(201, "User created successfully", { createdUser, token }),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
