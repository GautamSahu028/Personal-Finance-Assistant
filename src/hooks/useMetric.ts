import { useQuery, keepPreviousData } from "@tanstack/react-query";

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

export function useMetrics(
  range: string,
  customRange?: { start?: string; end?: string }
) {
  const params = new URLSearchParams();
  if (range !== "custom") {
    params.set("range", range);
  } else {
    if (customRange?.start) params.set("start", customRange.start);
    if (customRange?.end) params.set("end", customRange.end);
  }

  return useQuery<MetricsResponse, Error>({
    queryKey: ["metrics", params.toString()],
    queryFn: () => fetchMetrics(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
