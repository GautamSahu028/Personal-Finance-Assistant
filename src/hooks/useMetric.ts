// src/hooks/useMetric.ts
import { useQuery } from "@tanstack/react-query";

export type MetricsResponse = {
  byCategory?: Array<{
    category: string;
    type: "EXPENSE" | "INCOME" | string;
    _sum?: { amountCents?: number };
  }>;
  byDay?: Array<{
    day: string;
    type: "EXPENSE" | "INCOME" | string;
    amountcents?: number;
  }>;
};

async function fetchMetrics(params: URLSearchParams): Promise<MetricsResponse> {
  const res = await fetch(`/api/metrics?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Metrics fetch failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * useMetrics - fetch metrics with optional custom range and topN category limit
 *
 * @param range - e.g. "30d" or "custom"
 * @param customRange - { start?: ISODateString, end?: ISODateString }
 * @param topN - how many top categories to request (defaults to 10)
 */
export function useMetrics(
  range: string,
  customRange?: { start?: string; end?: string },
  topN: number = 10
) {
  // stable query key
  const key = [
    "metrics",
    range,
    customRange?.start ?? null,
    customRange?.end ?? null,
    topN,
  ];

  // build queryFn inside the call to avoid stale closures
  const queryFn = async () => {
    const params = new URLSearchParams();
    if (range !== "custom") {
      params.set("range", range);
    } else {
      if (customRange?.start) params.set("start", customRange.start);
      if (customRange?.end) params.set("end", customRange.end);
    }
    params.set("topN", String(Math.max(1, Math.floor(topN))));
    return fetchMetrics(params);
  };

  // NOTE: cast the options object to `any` so TypeScript doesn't complain about
  // `keepPreviousData` when your installed @tanstack/react-query types are out of sync.
  // If you update @tanstack/react-query to a recent v4 version you can remove the `as any`.
  return useQuery<MetricsResponse, Error>({
    queryKey: key,
    queryFn,
    // cast here to silence TS if your local types don't include keepPreviousData
    ...({ keepPreviousData: true, staleTime: 1000 * 60, retry: 1 } as any),
  });
}
