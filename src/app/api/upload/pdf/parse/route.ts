// app/api/upload/pdf2/route.ts
import { NextRequest, NextResponse } from "next/server";
// NOTE: do NOT import 'pdf-parse' at top-level — its wrapper may run debug code.
// We'll dynamically import the implementation inside the POST handler.
import axios from "axios";

export const config = {
  api: {
    bodyParser: false, // must be false for streaming/formData file uploads
  },
};

// Ensure Node runtime (pdf-parse uses Node Buffer)
export const runtime = "nodejs";

// -----------------------
// Utilities (unchanged)
// -----------------------
function splitLinesFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((ln) => ln.trim())
    .filter(Boolean);
}

function bestEffortParseLine(line: string) {
  const out: Record<string, string> = {
    "date-time": "",
    type: "",
    category: "",
    description: "",
    amount: "",
  };

  // 1) Try to remove amount at end (retain amount separately)
  const tokens = line.split(/\s+/);
  const amountPattern = /[+-]?\$?\d[\d,]*\.?\d*/;
  let amountToken = "";
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (amountPattern.test(tokens[i])) {
      amountToken = tokens[i];
      break;
    }
  }
  if (amountToken) {
    out.amount = amountToken;
    // remove last occurrence of amountToken from the raw line
    const idx = line.lastIndexOf(amountToken);
    if (idx >= 0) line = line.slice(0, idx).trim();
  }

  // 2) Extract leading date-time (examples: "9/9/2025, 3:51:00 AM", "9/7/2025 1:32:00 AM")
  // regex allows optional comma, optional seconds, optional AM/PM
  const dtRegex =
    /^(\d{1,2}\/\d{1,2}\/\d{4},?\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)/;
  const dtMatch = line.match(dtRegex);
  let remainder = line;
  if (dtMatch) {
    out["date-time"] = dtMatch[1].trim();
    remainder = line.slice(dtMatch[1].length).trim();
  } else {
    // fallback: if first two tokens look like date + time, use them
    const parts = line.split(/\s+/);
    if (
      parts.length >= 2 &&
      /\d{1,2}\/\d{1,2}\/\d{4}/.test(parts[0]) &&
      /\d{1,2}:\d{2}/.test(parts[1])
    ) {
      out["date-time"] = `${parts[0]} ${parts[1]}`;
      remainder = parts.slice(2).join(" ");
    }
  }

  // 3) Identify 'type' (INCOME/EXPENSE/CREDIT/DEBIT) as the first matching token in remainder
  // Look at first token (or first word) for these keywords
  const typeRegex = /^(INCOME|EXPENSE|CREDIT|DEBIT)/i;
  const remTrim = remainder.trim();
  let remTokens = remTrim ? remTrim.split(/\s+/) : [];

  if (remTokens.length > 0) {
    const tmatch = remTokens[0].match(typeRegex);
    if (tmatch) {
      out.type = tmatch[1].toUpperCase();
      remTokens = remTokens.slice(1);
    } else {
      // maybe the file uses lowercase or alternative words, check first token ignoring punctuation
      const t0 = remTokens[0].replace(/[:;,]/g, "");
      if (/^(income|expense|credit|debit)$/i.test(t0)) {
        out.type = t0.toUpperCase();
        remTokens = remTokens.slice(1);
      }
    }
  }

  // 4) Next token (if present) is category
  if (remTokens.length > 0) {
    out.category = remTokens[0];
    remTokens = remTokens.slice(1);
  }

  // 5) Rest is description
  if (remTokens.length > 0) {
    out.description = remTokens.join(" ");
  }

  // final cleanup: trim fields
  for (const k of Object.keys(out)) {
    if (typeof out[k] === "string") out[k] = out[k].trim();
  }

  return out;
}

function cleanupJsonLikeText(s: string) {
  if (!s) return s;
  const m = s.match(/\{[\s\S]*\}/);
  return m ? m[0] : s;
}

async function parseLinesWithHfApi(lines: string[]) {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) throw new Error("HF_TOKEN not set");

  const model = "google/flan-t5-small";
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(
    model
  )}`;
  const headers = { Authorization: `Bearer ${hfToken}` };

  const results: any[] = [];

  const fewShot = `Example:
Line: 9/9/2025, 3:51:00 AM INCOME sharemarket monthly-salary +$12000.00
JSON: {"date-time": "9/9/2025, 3:51:00 AM", "type": "INCOME", "category": "sharemarket", "description": "monthly-salary", "amount": "+$12000.00"}

`;

  for (const ln of lines) {
    const prompt =
      fewShot +
      `Extract the fields and return ONLY a single JSON object with keys: "date-time","type","category","description","amount".\nLine: ${ln}`;

    try {
      const resp = await axios.post(
        url,
        { inputs: prompt, parameters: { max_new_tokens: 128 } },
        { headers, timeout: 30000 }
      );

      let out = "";
      if (Array.isArray(resp.data) && resp.data[0]) {
        out =
          resp.data[0].generated_text ||
          resp.data[0].text ||
          JSON.stringify(resp.data[0]);
      } else {
        out = JSON.stringify(resp.data);
      }

      const jsonText = cleanupJsonLikeText(out);
      try {
        results.push(JSON.parse(jsonText));
      } catch {
        results.push(bestEffortParseLine(ln));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("PDF parse route error:", msg, err);
      return NextResponse.json(
        { error: msg || "Parsing failed" },
        { status: 500 }
      );
    }
  }

  return results;
}

// -----------------------
// POST handler (with lazy import of pdf-parse implementation)
// -----------------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Use form field 'file'." },
        { status: 400 }
      );
    }

    // Convert uploaded File -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ---------
    // Lazy import the real implementation (bypass the wrapper that runs debug fs calls)
    // ---------
    // @ts-ignore
    const pdfModule = await import("pdf-parse/lib/pdf-parse.js");
    const pdf = (pdfModule && (pdfModule.default || pdfModule)) as (
      buf: Buffer
    ) => Promise<any>;

    // Parse PDF from buffer
    const data = await pdf(buffer);
    const text = data.text ?? "";
    if (!text.trim()) {
      return NextResponse.json(
        { error: "No text extracted from PDF" },
        { status: 400 }
      );
    }

    const lines = splitLinesFromText(text);

    let parsed: any[];
    if (process.env.HF_TOKEN) {
      try {
        // @ts-ignore
        parsed = await parseLinesWithHfApi(lines);
      } catch (hfErr) {
        console.warn(
          "HF parsing failed, falling back to best-effort. Error:",
          (hfErr as Error).message
        );
        parsed = lines.map(bestEffortParseLine);
      }
    } else {
      parsed = lines.map(bestEffortParseLine);
    }

    const normalized = parsed.map((item) => ({
      "date-time": item?.["date-time"] || item?.date_time || item?.date || "",
      type: item?.type || "",
      category: item?.category || "",
      description: item?.description || "",
      amount: item?.amount || "",
    }));

    return NextResponse.json({ count: normalized.length, records: normalized });
  } catch (err: any) {
    console.error("PDF parse route error:", err);
    return NextResponse.json(
      { error: err.message || "Parsing failed" },
      { status: 500 }
    );
  }
}
