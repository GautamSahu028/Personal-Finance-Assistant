import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
	const session = await getSession();
	if (!session) return NextResponse.json({ user: null }, { status: 200 });
	const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, name: true } });
	return NextResponse.json({ user });
}


