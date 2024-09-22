import { NextRequest } from "next/server";

export interface CustomRequest extends NextRequest {
  userId: string;
}
