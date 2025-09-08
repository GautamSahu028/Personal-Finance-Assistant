import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import pdf from "pdf-parse";

export const runtime = "nodejs";

export async function POST(request: Request) {
	const session = await getSession();
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const form = await request.formData();
	const file = form.get("file");
	if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "Missing file" }, { status: 400 });
	}
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const parsed = await pdf(buffer);
	const text = parsed.text || "";

	// Simple table-like row parser: lines with 3-4 columns: date, description, amount
	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	let imported = 0;
	for (const line of lines) {
		const parts = line.split(/\s{2,}|\t/).map(p => p.trim()).filter(Boolean);
		if (parts.length < 3) continue;
		const [dateStr, ...rest] = parts;
		const last = rest[rest.length - 1];
		const desc = rest.slice(0, -1).join(" ") || "PDF Import";
		const date = new Date(dateStr);
		const amt = parseFloat(last.replace(/[^\d.-]/g, ""));
		if (!isNaN(date.getTime()) && !isNaN(amt) && Math.abs(amt) > 0) {
			const amountCents = Math.round(Math.abs(amt) * 100);
			const type = amt < 0 ? "EXPENSE" : "INCOME";
			await prisma.transaction.create({
				data: {
					userId: session.userId,
					type: type as any,
					amountCents,
					currency: "USD",
					category: type === "EXPENSE" ? "Imported" : "Income",
					description: desc,
					occurredAt: isNaN(date.getTime()) ? new Date() : date,
					source: "pdf",
				},
			});
			imported += 1;
		}
	}
	return NextResponse.json({ imported, lines: lines.length });
}


