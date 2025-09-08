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

    console.log("Metrics API called with params:", {
      range,
      start: startParam,
      end: endParam,
    });

    // Build a date filter object that can contain gte and/or lte
    let dateFilter: any = {};

    // Case A: Predefined range (like "7d", "30d", etc.)
    if (range && range !== "custom") {
      dateFilter = buildDateRange(range); // recommended to return { occurredAt: { gte, lte } }
    } else if (startParam || endParam) {
      // Case B: custom start / end params provided by client
      const parseDateSafe = (s?: string | null) => {
        if (!s) return null;
        const d = new Date(s);
        if (isNaN(d.getTime())) return null;
        return d;
      };

      const startDate = parseDateSafe(startParam);
      const rawEndDate = parseDateSafe(endParam);
      // make lte inclusive by bumping end to end-of-day if present
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
      // No date filter at all (fetch all time)
      dateFilter = {};
    }

    console.log("Computed dateFilter:", dateFilter);

    // Build a safe `where` object for Prisma calls
    const where: any = { userId };
    if (dateFilter.occurredAt) {
      where.occurredAt = dateFilter.occurredAt;
    }

    // byCategory using Prisma groupBy
    const byCategoryRaw = await prisma.transaction.groupBy({
      by: ["category", "type"],
      where,
      _sum: { amountCents: true },
    });

    // byDay aggregation using raw SQL with explicit branches depending on available bounds
    let byDayRaw: Array<{ day: string; type: string; amountcents: number }> =
      [];

    const occurredAt = dateFilter.occurredAt || null;
    if (occurredAt && occurredAt.gte && occurredAt.lte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`
        SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" BETWEEN ${occurredAt.gte} AND ${occurredAt.lte}
        GROUP BY day, type
        ORDER BY day ASC
      `;
    } else if (occurredAt && occurredAt.gte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`
        SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" >= ${occurredAt.gte}
        GROUP BY day, type
        ORDER BY day ASC
      `;
    } else if (occurredAt && occurredAt.lte) {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`
        SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
          AND "occurredAt" <= ${occurredAt.lte}
        GROUP BY day, type
        ORDER BY day ASC
      `;
    } else {
      byDayRaw = await prisma.$queryRaw<
        Array<{ day: string; type: string; amountcents: number }>
      >`
        SELECT DATE("occurredAt") as day,
               CAST(type AS text) as type,
               SUM("amountCents") as amountcents
        FROM "Transaction"
        WHERE "userId" = ${userId}
        GROUP BY day, type
        ORDER BY day ASC
      `;
    }

    // Normalize/convert numeric/bigint values to numbers for JSON
    const byCategory = byCategoryRaw.map((r) => ({
      category: r.category,
      type: r.type,
      _sum: { amountCents: Number(r._sum?.amountCents ?? 0) },
    }));

    const byDay = byDayRaw.map((r) => ({
      day: r.day,
      type: r.type,
      amountcents: Number(r.amountcents ?? 0),
    }));

    return NextResponse.json({ byCategory, byDay });
  } catch (err) {
    console.error("Metrics API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
