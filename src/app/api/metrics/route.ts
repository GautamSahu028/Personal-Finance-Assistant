import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.userId;
  const [byCategoryRaw, byDayRaw] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["category", "type"],
      where: { userId },
      _sum: { amountCents: true },
    }),
    prisma.$queryRawUnsafe<
      Array<{ day: string; type: string; amountcents: number }>
    >(
      `SELECT DATE("occurredAt") as day, CAST(type as text) as type, SUM("amountCents") as amountcents
			 FROM "Transaction" WHERE "userId" = $1 GROUP BY day, type ORDER BY day ASC`,
      userId
    ),
  ]);

  // Coerce potential bigint values to numbers for JSON serialization
  const byCategory = byCategoryRaw.map((r: any) => ({
    category: r.category,
    type: r.type,
    _sum: { amountCents: Number(r._sum?.amountCents ?? 0) },
  }));
  const byDay = (byDayRaw as any[]).map((r) => ({
    day: r.day,
    type: r.type,
    amountcents: Number(r.amountcents ?? 0),
  }));

  return NextResponse.json({ byCategory, byDay });
}
