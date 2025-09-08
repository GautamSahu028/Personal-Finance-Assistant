import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { LoginSchema } from "@/lib/schemas";
import { formatZodErrors } from "@/utils/formatErrors";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // ✅ Validate request body
    const { email, password } = LoginSchema.parse(json);

    console.log("Login attempt for:", email);

    // ✅ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn("Login failed: User not found", email);
      return NextResponse.json(
        { error: [{ field: "email", message: "Invalid credentials" }] },
        { status: 401 }
      );
    }

    // ✅ Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.warn("Login failed: Incorrect password", email);
      return NextResponse.json(
        { error: [{ field: "password", message: "Invalid credentials" }] },
        { status: 401 }
      );
    }

    // ✅ Create session
    await createSession(user.id);

    console.log("Login successful for:", email);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    // ✅ Zod validation errors
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error);
      console.warn("Login validation error:", formattedErrors);

      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    // ✅ Unknown errors
    console.error("Login server error:", error);
    return NextResponse.json(
      { error: [{ field: "server", message: "Internal Server Error" }] },
      { status: 500 }
    );
  }
}
