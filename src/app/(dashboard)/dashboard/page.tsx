// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
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

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("30d"); // default
  const [customRange, setCustomRange] = useState<{
    start?: string;
    end?: string;
  }>({});
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // If custom selected but dates incomplete, DON'T fetch and don't wipe current data.
    if (range === "custom" && !(customRange.start && customRange.end)) {
      console.log(
        "Custom range selected but start/end missing — skipping fetch"
      );
      return;
    }

    // Build params safely
    const params = new URLSearchParams();
    if (range !== "custom") {
      params.set("range", range);
    } else {
      params.set("start", customRange.start!);
      params.set("end", customRange.end!);
    }
    const url = `/api/metrics?${params.toString()}`;
    console.log("Fetching data from:", url);

    setIsFetching(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Network response not ok");
        return r.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Metrics fetch failed:", err);
        // keep previous data instead of clearing it (better UX)
      })
      .finally(() => setIsFetching(false));
  }, [range, customRange]);

  // Show spinner only while actively fetching. If user selected custom and hasn't picked dates,
  // the effect returned early and `data` remains whatever it was (no spinner).
  if (isFetching && !data) {
    // initial load fallback
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">
              Loading analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user selected custom but hasn't chosen both dates, show a gentle message (and keep previous data)
  if (range === "custom" && !(customRange.start && customRange.end) && data) {
    // we render the dashboard normally (using previous `data`) but show a small hint in header
    // (we'll let the rest of the UI render using existing `data`)
  }

  // If still no data at all (first load failed), show fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">
              Loading analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- existing rendering logic (unchanged) ---
  const byCategory = data.byCategory || [];
  const catLabels: string[] = Array.from(
    new Set(
      byCategory
        .filter((x: any) => x.type === "EXPENSE")
        .map((x: any) => x.category)
    )
  );
  const catValues = catLabels.map((c) => {
    const sum = byCategory
      .filter((x: any) => x.category === c && x.type === "EXPENSE")
      .reduce((a: number, b: any) => a + (b._sum?.amountCents || 0), 0);
    return Math.round(sum / 100);
  });

  const byDay = data.byDay || [];
  const dayLabels: string[] = Array.from(new Set(byDay.map((x: any) => x.day)));
  const expenseSeries = dayLabels.map((d) =>
    Math.round(
      (byDay.find((x: any) => x.day === d && x.type === "EXPENSE")
        ?.amountcents || 0) / 100
    )
  );
  const incomeSeries = dayLabels.map((d) =>
    Math.round(
      (byDay.find((x: any) => x.day === d && x.type === "INCOME")
        ?.amountcents || 0) / 100
    )
  );

  const totalIncome = incomeSeries.reduce((a, b) => a + b, 0);
  const totalExpenses = expenseSeries.reduce((a, b) => a + b, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
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
            <DateRangeFilter
              value={range}
              onChange={(val, custom) => {
                setRange(val);
                if (custom) setCustomRange(custom);
              }}
            />

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
          {/* If custom selected but dates missing, show a subtle hint */}
          {range === "custom" && !(customRange.start && customRange.end) && (
            <div className="mt-3 text-sm text-amber-600">
              Select start and end dates to load the custom range.
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Section */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Expenses by Category Chart */}
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
                          family: "system-ui, -apple-system, sans-serif",
                        },
                        color: "#475569",
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      titleColor: "#f1f5f9",
                      bodyColor: "#f1f5f9",
                      cornerRadius: 8,
                      titleFont: {
                        size: 14,
                        weight: 600,
                      },
                      bodyFont: {
                        size: 13,
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  cutout: "60%",
                }}
              />
            </div>
          </ChartCard>

          {/* Income vs Expense Chart */}
          <ChartCard
            title="Cash Flow Analysis"
            subtitle="Daily income vs expenses"
          >
            <div className="h-80">
              <Bar
                data={{
                  labels: dayLabels,
                  datasets: [
                    {
                      label: "Expenses",
                      data: expenseSeries,
                      backgroundColor: "rgba(244, 63, 94, 0.7)", // rose-500 with transparency
                      borderColor: "#be123c", // rose-700
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    },
                    {
                      label: "Income",
                      data: incomeSeries,
                      backgroundColor: "rgba(16, 185, 129, 0.7)", // emerald-500 with transparency
                      borderColor: "#065f46", // emerald-800
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                      labels: {
                        padding: 20,
                        font: {
                          size: 13,
                          weight: 500,
                          family: "system-ui, -apple-system, sans-serif",
                        },
                        color: "#475569",
                        usePointStyle: true,
                        pointStyle: "rect",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      titleColor: "#f1f5f9",
                      bodyColor: "#f1f5f9",
                      cornerRadius: 8,
                      titleFont: {
                        size: 14,
                        weight: 600,
                      },
                      bodyFont: {
                        size: 13,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: {
                          size: 12,
                          weight: 500,
                        },
                        color: "#64748b",
                      },
                      border: {
                        color: "#e2e8f0",
                      },
                    },
                    y: {
                      grid: {
                        color: "#f1f5f9",
                      },
                      ticks: {
                        font: {
                          size: 12,
                          weight: 500,
                        },
                        color: "#64748b",
                        callback: function (value) {
                          return "$" + value;
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
