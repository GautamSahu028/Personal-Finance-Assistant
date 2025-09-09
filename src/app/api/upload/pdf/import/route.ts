// src/app/api/upload/pdf/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type InputRecord = {
  "date-time": string;
  type: string;
  category: string;
  description: string;
  amount: string;
};

type InputBody = {
  count: number;
  records: InputRecord[];
};

function parseAmountToCents(amountStr: string) {
  if (!amountStr || typeof amountStr !== "string") return null;
  // remove currency symbols, spaces; keep leading +/-
  const cleaned = amountStr.replace(/[^\d.+-]/g, "");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return null;
  const cents = Math.round(Math.abs(parsed) * 100);
  return { cents, signed: parsed };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Accept only JSON
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body: InputBody = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.records)) {
      return NextResponse.json(
        { error: "Invalid JSON. Expected shape: { count, records: [...] }" },
        { status: 400 }
      );
    }

    const results: Array<{
      index: number;
      created: boolean;
      id?: string;
      reason?: string;
    }> = [];
    let createdCount = 0;

    for (let i = 0; i < body.records.length; i++) {
      const rec = body.records[i];

      // Basic validation
      if (
        !rec ||
        typeof rec["date-time"] !== "string" ||
        typeof rec.type !== "string" ||
        typeof rec.amount !== "string"
      ) {
        results.push({
          index: i,
          created: false,
          reason: "invalid_record_shape",
        });
        continue;
      }

      // Parse date
      const occurredAtCandidate = new Date(rec["date-time"]);
      if (isNaN(occurredAtCandidate.getTime())) {
        results.push({ index: i, created: false, reason: "invalid_date" });
        continue;
      }

      // Parse amount
      const amt = parseAmountToCents(rec.amount);
      if (!amt || typeof amt.cents !== "number" || amt.cents <= 0) {
        results.push({ index: i, created: false, reason: "invalid_amount" });
        continue;
      }

      // Determine type: prefer provided type, else infer from sign
      const typeUpper = (rec.type || "").toUpperCase();
      const type =
        typeUpper === "EXPENSE" || typeUpper === "INCOME"
          ? typeUpper
          : amt.signed < 0
          ? "EXPENSE"
          : "INCOME";

      // Insert into DB
      try {
        const tx = await prisma.transaction.create({
          data: {
            userId: session.userId,
            type: type as any,
            amountCents: amt.cents,
            currency: "USD",
            category:
              rec.category || (type === "EXPENSE" ? "Imported" : "Income"),
            description: rec.description || "PDF JSON import",
            occurredAt: occurredAtCandidate,
            source: "pdf-json",
          },
        });

        createdCount++;
        results.push({ index: i, created: true, id: tx.id });
      } catch (dbErr: any) {
        console.error("DB insert error for record", i, dbErr);
        results.push({ index: i, created: false, reason: "db_error" });
      }
    }

    return NextResponse.json({
      imported: createdCount,
      total: body.records.length,
      perRecord: results,
    });
  } catch (err: any) {
    console.error("api/upload/pdf POST error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
