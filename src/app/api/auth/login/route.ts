import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export async function POST(request: Request) {
	try {
		const json = await request.json();
		const { email, password } = LoginSchema.parse(json);
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		await createSession(user.id);
		return NextResponse.json({ id: user.id, email: user.email, name: user.name });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}


