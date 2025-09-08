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
  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);
  if (!data) return <div className="p-6">Loading...</div>;

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium mb-2">Expenses by Category</h2>
          <Doughnut
            data={{
              labels: catLabels,
              datasets: [
                {
                  data: catValues,
                  backgroundColor: [
                    "#60a5fa",
                    "#34d399",
                    "#f472b6",
                    "#fbbf24",
                    "#a78bfa",
                    "#f87171",
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium mb-2">Income vs Expense by Day</h2>
          <Bar
            data={{
              labels: dayLabels,
              datasets: [
                {
                  label: "Expenses",
                  data: expenseSeries,
                  backgroundColor: "#f87171",
                },
                {
                  label: "Income",
                  data: incomeSeries,
                  backgroundColor: "#34d399",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
