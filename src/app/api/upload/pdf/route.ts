// src/app/api/upload/pdf/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import pdf from "pdf-parse";

export const runtime = "nodejs";

async function parsePdfBufferToText(buffer: Buffer) {
  try {
    const parsed = await pdf(buffer);
    return parsed?.text ?? "";
  } catch (err) {
    throw new Error(
      "pdf-parse failed: " + ((err as Error).message ?? String(err))
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");

    console.log("api/upload/pdf called");
    console.log("incoming file typeof:", typeof file);
    console.log("file instanceof File:", file instanceof File);
    if (file && typeof (file as any).name === "string") {
      console.log("uploaded filename:", (file as any).name);
    }

    if (!file) {
      return NextResponse.json(
        { error: "Missing 'file' in form data" },
        { status: 400 }
      );
    }

    // IMPORTANT: never treat incoming string as a server path.
    // If a client sends a string, return a clear error and instructions.
    if (typeof file === "string") {
      console.warn(
        "Rejected string 'file' upload from client. Clients must send binary FormData."
      );
      return NextResponse.json(
        {
          error:
            "Invalid upload: file was sent as a string path. Upload must be multipart/form-data with the file binary.",
          hint: "If using curl: use -F \"file=@/full/path/to/file.pdf\" (note the @). If using supertest: use .attach('file', filepath).",
          received: file,
        },
        { status: 400 }
      );
    }

    // Expect a browser File or Blob-like object
    if (
      !(file instanceof File) &&
      !(file && typeof (file as any).arrayBuffer === "function")
    ) {
      return NextResponse.json(
        { error: "Unsupported file object uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: "Empty file uploaded" },
        { status: 400 }
      );
    }
    console.log("buffer length:", buffer.length);

    // parse PDF -> text
    let parsedText = "";
    try {
      parsedText = await parsePdfBufferToText(buffer);
    } catch (err: any) {
      console.error("pdf-parse failed:", err?.message ?? err);
      return NextResponse.json(
        { error: "pdf-parse failed", detail: err?.message ?? String(err) },
        { status: 422 }
      );
    }

    console.log("parsed text length:", parsedText.length);
    console.log(
      "parsed text preview:",
      parsedText.slice(0, 400).replace(/\n/g, "\\n")
    );

    // Simple parser (keeps original behavior)
    const lines = parsedText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    let imported = 0;
    for (const line of lines) {
      const parts = line
        .split(/\s{2,}|\t/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length < 3) continue;
      const [dateStr, ...rest] = parts;
      const last = rest[rest.length - 1];
      const desc = rest.slice(0, -1).join(" ") || "PDF Import";
      const date = new Date(dateStr);
      const parenNegative = /^\(.*\)$/.test(last);
      const cleaned = last.replace(/[()]/g, "");
      const amt = parseFloat(cleaned.replace(/[^\d.-]/g, ""));
      const signedAmt = parenNegative ? -Math.abs(amt) : amt;

      if (
        !isNaN(date.getTime()) &&
        !isNaN(signedAmt) &&
        Math.abs(signedAmt) > 0
      ) {
        const amountCents = Math.round(Math.abs(signedAmt) * 100);
        const type = signedAmt < 0 ? "EXPENSE" : "INCOME";

        await prisma.transaction.create({
          data: {
            userId: session.userId,
            type: type as any,
            amountCents,
            currency: "USD",
            category: type === "EXPENSE" ? "Imported" : "Income",
            description: desc,
            occurredAt: date,
            source: "pdf",
          },
        });
        imported += 1;
      }
    }

    const previewLimit = 2000;
    const parsedPreview =
      parsedText.length > previewLimit
        ? parsedText.slice(0, previewLimit) + "...(truncated)"
        : parsedText;

    return NextResponse.json({
      imported,
      totalLines: lines.length,
      debug: {
        bufferLength: buffer.length,
        parsedTextLength: parsedText.length,
        parsedPreview,
      },
    });
  } catch (err: any) {
    console.error("api/upload/pdf error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
