import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./utils/ApiError";
import secretKey from "./utils/encodeJWT";

export async function middleware(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization") || "";
    const verifiedToken = jwtVerify(token, secretKey);

    if (!verifiedToken) {
      return Response.json(new ApiError(401, "Unauthorized"), { status: 401 });
    }

    const { _id } = (await verifiedToken).payload;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", _id as string);

    const response = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}

export const config = {
  matcher: [
    "/api/check-invitation",
    "/api/accept-invitation",
    "/api/reject-invitation",
    "/api/cancel-invitation",
    "/api/invitations",
    "/api/conversations",
    "/api/search",
    "/api/chat-details/:path*",
    "/api/send-message",
    "/api/all-messages/:path*",
    "/api/update-lang-prefs",
  ],
};
