// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { BalanceIcon, ExpenseIcon, IncomeIcon } from "@/components/Icons";
import { generateColors } from "@/utils/generateColors";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { useDebounced } from "@/hooks/useDebounced";
import { useMetrics } from "@/hooks/useMetric";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function DashboardPage() {
  // --- top-level state hooks (always run) ---
  const [range, setRange] = useState("30d");
  const [customRange, setCustomRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  // debounced copy of customRange (hook also always runs)
  const debouncedCustom = useDebounced(customRange, 500);

  // Decide whether to include customRange in query params
  // (calculation is not a hook; it's safe)
  const shouldFetchCustom =
    range !== "custom" || (debouncedCustom.start && debouncedCustom.end);

  // Query hook (always runs)
  const { data, isLoading, isError, error, refetch, isFetching } = useMetrics(
    range,
    shouldFetchCustom ? debouncedCustom : undefined
  );

  // --- derived values via useMemo (always run in same order) ---
  const byCategory = data?.byCategory || [];
  const catLabels = useMemo(
    () =>
      Array.from(
        new Set(
          byCategory
            .filter((x: any) => x.type === "EXPENSE")
            .map((x: any) => x.category)
        )
      ),
    [byCategory]
  );
  const catValues = useMemo(
    () =>
      catLabels.map((c) =>
        Math.round(
          byCategory
            .filter((x: any) => x.category === c && x.type === "EXPENSE")
            .reduce((a: number, b: any) => a + (b._sum?.amountCents || 0), 0) /
            100
        )
      ),
    [byCategory, catLabels]
  );

  const byDay = data?.byDay || [];
  const dayLabels = useMemo(
    () => Array.from(new Set(byDay.map((x: any) => x.day))),
    [byDay]
  );
  const expenseSeries = useMemo(
    () =>
      dayLabels.map((d) =>
        Math.round(
          (byDay.find((x: any) => x.day === d && x.type === "EXPENSE")
            ?.amountcents || 0) / 100
        )
      ),
    [byDay, dayLabels]
  );
  const incomeSeries = useMemo(
    () =>
      dayLabels.map((d) =>
        Math.round(
          (byDay.find((x: any) => x.day === d && x.type === "INCOME")
            ?.amountcents || 0) / 100
        )
      ),
    [byDay, dayLabels]
  );

  const totalIncome = useMemo(
    () => incomeSeries.reduce((a, b) => a + b, 0),
    [incomeSeries]
  );
  const totalExpenses = useMemo(
    () => expenseSeries.reduce((a, b) => a + b, 0),
    [expenseSeries]
  );
  const netBalance = totalIncome - totalExpenses;

  // --- conditional rendering using already-declared hooks ---
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Unable to load metrics</h3>
          <p className="text-sm text-slate-600 mb-4">
            {error?.message || "Something went wrong."}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard UI (data may be placeholderData while fetching, that's fine)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Financial Overview
              </h1>
              <p className="mt-2 text-slate-600">
                Comprehensive analysis of your financial performance
              </p>
            </div>

            {/* Last updated info only */}
            <div className="text-right">
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium mb-1">
                Last Updated
              </div>
              <div className="text-slate-900 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-slate-700">
                Filter by date range:
              </div>
              <DateRangeFilter
                value={range}
                onChange={(val, custom) => {
                  setRange(val);
                  if (custom) setCustomRange(custom);
                }}
              />
            </div>

            {isFetching && (
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                Updating data…
              </div>
            )}
          </div>

          {range === "custom" && !(customRange.start && customRange.end) && (
            <div className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
              Select start and end dates to load the custom range.
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="w-full px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Income"
            value={`$${totalIncome.toLocaleString()}`}
            icon={IncomeIcon}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={ExpenseIcon}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <MetricCard
            title="Net Balance"
            value={`$${Math.abs(netBalance).toLocaleString()}`}
            icon={BalanceIcon}
            iconBgColor={netBalance >= 0 ? "bg-blue-100" : "bg-orange-100"}
            iconColor={netBalance >= 0 ? "text-blue-600" : "text-orange-600"}
            valueColor={netBalance >= 0 ? "text-slate-900" : "text-orange-600"}
            subtitle={netBalance < 0 ? "(deficit)" : undefined}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartCard
            title="Expense Distribution"
            subtitle="Breakdown by category"
          >
            <div className="h-80 flex items-center justify-center">
              <Doughnut
                data={{
                  labels: catLabels,
                  datasets: [
                    {
                      data: catValues,
                      backgroundColor: generateColors(catLabels.length),
                      borderWidth: 2,
                      borderColor: "#ffffff",
                      hoverOffset: 8,
                      hoverBorderWidth: 3,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom" as const,
                      labels: {
                        padding: 20,
                        font: {
                          size: 13,
                          weight: 500,
                          family: "system-ui, sans-serif",
                        },
                        color: "#475569",
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(15,23,42,0.9)",
                      titleColor: "#f1f5f9",
                      bodyColor: "#f1f5f9",
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: 600 },
                      bodyFont: { size: 13 },
                    },
                  },
                  maintainAspectRatio: false,
                  cutout: "60%",
                }}
              />
            </div>
          </ChartCard>

          <ChartCard
            title="Cash Flow Analysis"
            subtitle="Daily income vs expenses"
          >
            <div className="h-80">
              <Bar
                // Replace your Bar chart data configuration with this:
                data={{
                  labels: (() => {
                    // Create sorted array of original dayLabels with their indices
                    const sortedDayLabels = dayLabels
                      .map((day, index) => ({ day, index }))
                      .sort(
                        (a, b) =>
                          new Date(a.day).getTime() - new Date(b.day).getTime()
                      );

                    // Return formatted labels
                    return sortedDayLabels.map((item) => {
                      const date = new Date(item.day);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    });
                  })(),
                  datasets: [
                    {
                      label: "Expenses",
                      data: (() => {
                        // Sort data to match the sorted labels
                        const sortedDayLabels = dayLabels
                          .map((day, index) => ({ day, index }))
                          .sort(
                            (a, b) =>
                              new Date(a.day).getTime() -
                              new Date(b.day).getTime()
                          );

                        return sortedDayLabels.map(
                          (item) => expenseSeries[item.index]
                        );
                      })(),
                      backgroundColor: "rgba(244,63,94,0.7)",
                      borderColor: "#be123c",
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    },
                    {
                      label: "Income",
                      data: (() => {
                        // Sort data to match the sorted labels
                        const sortedDayLabels = dayLabels
                          .map((day, index) => ({ day, index }))
                          .sort(
                            (a, b) =>
                              new Date(a.day).getTime() -
                              new Date(b.day).getTime()
                          );

                        return sortedDayLabels.map(
                          (item) => incomeSeries[item.index]
                        );
                      })(),
                      backgroundColor: "rgba(16,185,129,0.7)",
                      borderColor: "#065f46",
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    },
                  ],
                }}
              />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
