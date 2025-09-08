import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Tesseract from "tesseract.js";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  const preprocessed = await sharp(inputBuffer)
    .grayscale()
    .normalize()
    .toBuffer();
  const { data } = await Tesseract.recognize(preprocessed, "eng");
  const text = data.text || "";

  // Simple heuristic parser to find total-like lines
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  let amountCents: number | null = null;
  let merchant: string | undefined;
  for (const line of lines) {
    if (!merchant && line.length > 2 && line.length < 50) merchant = line;
    const m =
      line.match(/total[^\d]*([\d,.]+)/i) ||
      line.match(/amount[^\d]*([\d,.]+)/i);
    if (m) {
      const normalized = m[1].replace(/,/g, "");
      const value = Math.round(parseFloat(normalized) * 100);
      if (!isNaN(value) && value > 0) {
        amountCents = value;
        break;
      }
    }
  }
  if (!amountCents) {
    return NextResponse.json(
      { error: "Unable to extract amount", details: { text } },
      { status: 422 }
    );
  }
  const created = await prisma.transaction.create({
    data: {
      userId: session.userId,
      type: "EXPENSE",
      amountCents,
      currency: "USD",
      category: "Uncategorized",
      description: "Imported from receipt",
      occurredAt: new Date(),
      source: "receipt",
      merchant,
      notes: text.slice(0, 2000),
    },
  });
  return NextResponse.json({ id: created.id, amountCents, merchant });
}
