// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/schemas";
import { formatZodErrors } from "@/utils/formatErrors";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // ✅ Validate request body
    const { email, password, name } = RegisterSchema.parse(json);

    console.log("Register attempt for:", email);

    // ✅ Check for duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.warn("Register failed: Email already exists", email);
      return NextResponse.json(
        { error: [{ field: "email", message: "Email already registered" }] },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // ✅ Create user
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    console.log("User registered successfully:", email);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    // ✅ Zod validation errors
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error);
      console.warn("Register validation error:", formattedErrors);

      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    // ✅ Unknown errors
    console.error("Register server error:", error);
    return NextResponse.json(
      { error: [{ field: "server", message: "Internal Server Error" }] },
      { status: 500 }
    );
  }
}
