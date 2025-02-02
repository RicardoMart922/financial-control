import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userName, email, password } = await request.json();

    if (!userName || !email || !password) {
      return NextResponse.json({ message: "userName, email and password are required." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  }
  catch(error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  finally {
    await prisma.$disconnect();
  }
}