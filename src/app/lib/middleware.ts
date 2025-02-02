import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyToken(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Token not provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } 
  catch (error) {
    throw new Error("Invalid or expired token");
  }
}
