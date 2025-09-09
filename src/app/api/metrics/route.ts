// src/app/api/metrics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { buildDateRange } from "@/utils/datRange";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const url = new URL(req.url);
    const range = url.searchParams.get("range");
    const startParam = url.searchParams.get("start");
    const endParam = url.searchParams.get("end");
    const topN = Math.max(1, Number(url.searchParams.get("topN") ?? 10)); // default to 10

    // --- Build date filter (same logic you had) ---
    let dateFilter: any = {};
    if (range && range !== "custom") {
      dateFilter = buildDateRange(range);
    } else if (startParam || endParam) {
      const parseDateSafe = (s?: string | null) => {
        if (!s) return null;
        const d = new Date(s);
        if (isNaN(d.getTime())) return null;
        return d;
      };

      const startDate = parseDateSafe(startParam);
      const rawEndDate = parseDateSafe(endParam);
      const endDate = rawEndDate
        ? new Date(rawEndDate.setHours(23, 59, 59, 999))
        : null;

      if (startDate && endDate) {
        dateFilter = { occurredAt: { gte: startDate, lte: endDate } };
      } else if (startDate) {
        dateFilter = { occurredAt: { gte: startDate } };
      } else if (endDate) {
        dateFilter = { occurredAt: { lte: endDate } };
      } else {
        dateFilter = {};
      }
    } else {
      dateFilter = {};
    }

    const hasRange = !!dateFilter.occurredAt;
    const gte = hasRange ? dateFilter.occurredAt.gte : null;
    const lte = hasRange ? dateFilter.occurredAt.lte : null;

    // --- 1) Fetch top N categories by sum(amountCents) ---
    let topCategoriesRaw: Array<{
      category: string;
      type: string;
      amountcents: bigint | number;
    }> = [];

    if (hasRange && gte && lte) {
      topCategoriesRaw = await prisma.$queryRaw<
        Array<{ category: string; type: string; amountcents: bigint | number }>
      >`SELECT "category", CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" BETWEEN ${gte} AND ${lte}
          GROUP BY "category", type
          ORDER BY SUM("amountCents") DESC
          LIMIT ${topN}`;
    } else if (hasRange && gte) {
      topCategoriesRaw = await prisma.$queryRaw<
        Array<{ category: string; type: string; amountcents: bigint | number }>
      >`SELECT "category", CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" >= ${gte}
          GROUP BY "category", type
          ORDER BY SUM("amountCents") DESC
          LIMIT ${topN}`;
    } else if (hasRange && lte) {
      topCategoriesRaw = await prisma.$queryRaw<
        Array<{ category: string; type: string; amountcents: bigint | number }>
      >`SELECT "category", CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" <= ${lte}
          GROUP BY "category", type
          ORDER BY SUM("amountCents") DESC
          LIMIT ${topN}`;
    } else {
      topCategoriesRaw = await prisma.$queryRaw<
        Array<{ category: string; type: string; amountcents: bigint | number }>
      >`SELECT "category", CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
          GROUP BY "category", type
          ORDER BY SUM("amountCents") DESC
          LIMIT ${topN}`;
    }

    const topCategories = topCategoriesRaw.map((r) => ({
      category: r.category,
      type: r.type,
      _sum: { amountCents: Number(r.amountcents ?? 0) },
    }));

    // --- 2) Total sum per type (to compute Others = total - topSum) ---
    let totalByTypeRaw: Array<{ type: string; amountcents: bigint | number }> =
      [];

    if (hasRange && gte && lte) {
      totalByTypeRaw = await prisma.$queryRaw<
        Array<{ type: string; amountcents: bigint | number }>
      >`SELECT CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" BETWEEN ${gte} AND ${lte}
          GROUP BY type`;
    } else if (hasRange && gte) {
      totalByTypeRaw = await prisma.$queryRaw<
        Array<{ type: string; amountcents: bigint | number }>
      >`SELECT CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" >= ${gte}
          GROUP BY type`;
    } else if (hasRange && lte) {
      totalByTypeRaw = await prisma.$queryRaw<
        Array<{ type: string; amountcents: bigint | number }>
      >`SELECT CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
            AND "occurredAt" <= ${lte}
          GROUP BY type`;
    } else {
      totalByTypeRaw = await prisma.$queryRaw<
        Array<{ type: string; amountcents: bigint | number }>
      >`SELECT CAST(type AS text) as type, SUM("amountCents") as amountcents
          FROM "Transaction"
          WHERE "userId" = ${userId}
          GROUP BY type`;
    }

    const totalByType = totalByTypeRaw.reduce(
      (acc: Record<string, number>, r) => {
        acc[r.type] = Number(r.amountcents ?? 0);
        return acc;
      },
      {}
    );

    // Sum of topN grouped by type
    const topSumsByType = topCategories.reduce(
      (acc: Record<string, number>, r) => {
        acc[r.type] = (acc[r.type] || 0) + (r._sum?.amountCents || 0);
        return acc;
      },
      {}
    );

    // Compute Others per type
    const others: Array<{ type: string; amountcents: number }> = Object.keys(
      totalByType
    ).map((type) => {
      const othersAmount = Math.max(
        0,
        totalByType[type] - (topSumsByType[type] || 0)
      );
      return { type, amountcents: othersAmount };
    });

    // Build final byCategory array: top categories + "Others" rows
    const byCategory = [
      ...topCategories,
      ...others
        .filter((o) => o.amountcents > 0)
        .map((o) => ({
          category: "Others",
          type: o.type,
          _sum: { amountCents: Number(o.amountcents) },
        })),
    ];

    // --- byDay aggregation (explicit branches, same pattern) ---
    let byDayRaw: Array<{ day: string; type: string; amountcents: number }> =
      [];

    if (hasRange && gte && lte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" BETWEEN ${gte} AND ${lte}
        GROUP BY day, type
        ORDER BY day ASC`;
    } else if (hasRange && gte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" >= ${gte}
        GROUP BY day, type
        ORDER BY day ASC`;
    } else if (hasRange && lte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" <= ${lte}
        GROUP BY day, type
        ORDER BY day ASC`;
    } else {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
        GROUP BY day, type
        ORDER BY day ASC`;
    }

    const normalizedByDay = byDayRaw.map((r) => ({
      day: r.day,
      type: r.type,
      amountcents: Number(r.amountcents ?? 0),
    }));

    return NextResponse.json({ byCategory, byDay: normalizedByDay });
  } catch (err) {
    console.error("Metrics API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
