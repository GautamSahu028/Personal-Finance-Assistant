import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(1).optional(),
});

export async function POST(request: Request) {
	try {
		const json = await request.json();
		const { email, password, name } = RegisterSchema.parse(json);

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return NextResponse.json({ error: "Email already registered" }, { status: 409 });
		}

		const passwordHash = await bcrypt.hash(password, 12);
		const user = await prisma.user.create({ data: { email, passwordHash, name } });
		return NextResponse.json({ id: user.id, email: user.email, name: user.name });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}


