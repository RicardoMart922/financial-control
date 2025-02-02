import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      return NextResponse.json({ message: "Password invalid" }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        userName: user.userName
      }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect();
  }
}