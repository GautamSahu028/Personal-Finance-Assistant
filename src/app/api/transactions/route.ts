import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const CreateSchema = z.object({
	type: z.enum(["INCOME", "EXPENSE"]),
	amountCents: z.number().int().positive(),
	currency: z.string().default("USD"),
	category: z.string().min(1),
	description: z.string().optional(),
	occurredAt: z.string().datetime(),
	merchant: z.string().optional(),
	source: z.string().optional(),
	notes: z.string().optional(),
});

export async function POST(request: Request) {
	const session = await getSession();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	try {
		const payload = await request.json();
		const data = CreateSchema.parse(payload);
		const created = await prisma.transaction.create({
			data: {
				userId: session.userId,
				type: data.type as any,
				amountCents: data.amountCents,
				currency: data.currency,
				category: data.category,
				description: data.description,
				merchant: data.merchant,
				source: data.source ?? "manual",
				notes: data.notes,
				occurredAt: new Date(data.occurredAt),
			},
		});
		return NextResponse.json({ id: created.id });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

const ListQuery = z.object({
	start: z.string().datetime().optional(),
	end: z.string().datetime().optional(),
	type: z.enum(["INCOME", "EXPENSE"]).optional(),
	category: z.string().optional(),
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: Request) {
	const session = await getSession();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const parseObj = Object.fromEntries(searchParams.entries());
	const q = ListQuery.parse(parseObj);
	const where: any = { userId: session.userId };
	if (q.type) where.type = q.type;
	if (q.category) where.category = q.category;
	if (q.start || q.end) {
		where.occurredAt = {} as any;
		if (q.start) (where.occurredAt as any).gte = new Date(q.start);
		if (q.end) (where.occurredAt as any).lte = new Date(q.end);
	}
	const skip = (q.page - 1) * q.pageSize;
	const [items, total] = await Promise.all([
		prisma.transaction.findMany({
			where,
			orderBy: { occurredAt: "desc" },
			skip,
			take: q.pageSize,
		}),
		prisma.transaction.count({ where }),
	]);
	return NextResponse.json({ items, total, page: q.page, pageSize: q.pageSize });
}


