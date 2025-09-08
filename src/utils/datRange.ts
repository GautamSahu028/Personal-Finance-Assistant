export function buildDateRange(range?: string | null) {
  if (!range) return {};

  const match = range.match(/^(\d+)d$/);
  if (match) {
    const days = parseInt(match[1], 10);
    const now = new Date();
    const gte = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // return both bounds so downstream SQL using BETWEEN works
    return { occurredAt: { gte, lte: now } };
  }

  return {}; // Default: no filter
}
