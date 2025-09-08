// src/components/dashboard/DateRangeFilter.tsx (small change)
"use client";
import { useState } from "react";

interface DateRangeFilterProps {
  value: string;
  onChange: (
    value: string,
    customRange?: { start?: string; end?: string }
  ) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [customRange, setCustomRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  const handleCustomChange = (field: "start" | "end", val: string) => {
    const updated = { ...customRange, [field]: val };
    setCustomRange(updated);
    onChange("custom", updated);
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value, customRange)} // <-- pass current customRange
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="custom">Custom</option>
      </select>

      {value === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customRange.start || ""}
            onChange={(e) => handleCustomChange("start", e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={customRange.end || ""}
            onChange={(e) => handleCustomChange("end", e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
      )}
    </div>
  );
}
