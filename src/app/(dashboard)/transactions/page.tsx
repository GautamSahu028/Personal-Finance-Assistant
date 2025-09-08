"use client";
import { useEffect, useState } from "react";

type Tx = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  currency: string;
  category: string;
  description?: string;
  occurredAt: string;
};

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<{
    type?: string;
    category?: string;
    start?: string;
    end?: string;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (filters.type) params.set("type", filters.type);
    if (filters.category) params.set("category", filters.category);
    if (filters.start)
      params.set("start", new Date(filters.start).toISOString());
    if (filters.end) params.set("end", new Date(filters.end).toISOString());
    fetch(`/api/transactions?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTotal(d.total || 0);
      });
  }, [page, pageSize, filters]);

  async function onAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: formData.get("type"),
        amountCents: Math.round(Number(formData.get("amount")) * 100),
        currency: "USD",
        category: formData.get("category"),
        description: formData.get("description") || undefined,
        occurredAt: new Date(String(formData.get("occurredAt"))).toISOString(),
      }),
    });
    if (res.ok) {
      (e.currentTarget as HTMLFormElement).reset();
      setPage(1);
      setFilters({ ...filters });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <div className="bg-white p-4 rounded shadow">
        <form
          onSubmit={onAddSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
        >
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select name="type" className="border rounded px-2 py-2 w-full">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              className="border rounded px-2 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              name="category"
              className="border rounded px-2 py-2 w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <input
              name="description"
              className="border rounded px-2 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              name="occurredAt"
              type="datetime-local"
              className="border rounded px-2 py-2 w-full"
              required
            />
          </div>
          <div className="md:col-span-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <select
            value={filters.type || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value || undefined }))
            }
            className="border rounded px-2 py-2"
          >
            <option value="">All types</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <input
            placeholder="Category"
            value={filters.category || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                category: e.target.value || undefined,
              }))
            }
            className="border rounded px-2 py-2"
          />
          <input
            type="date"
            value={filters.start || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, start: e.target.value || undefined }))
            }
            className="border rounded px-2 py-2"
          />
          <input
            type="date"
            value={filters.end || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, end: e.target.value || undefined }))
            }
            className="border rounded px-2 py-2"
          />
          <button
            onClick={() => setPage(1)}
            className="bg-gray-100 border rounded px-3 py-2"
          >
            Filter
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx) => (
              <tr key={tx.id} className="border-b">
                <td className="py-2">
                  {new Date(tx.occurredAt).toLocaleString()}
                </td>
                <td>{tx.type}</td>
                <td>{tx.category}</td>
                <td>{tx.description || "-"}</td>
                <td className="text-right">
                  {tx.type === "EXPENSE" ? "-" : "+"}$
                  {(tx.amountCents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">Total: {total}</span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page * pageSize >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">Import</h2>
        <div className="flex gap-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const res = await fetch("/api/upload/receipt", {
                method: "POST",
                body: fd,
              });
              if (res.ok) setFilters({ ...filters });
            }}
          >
            <input
              name="file"
              type="file"
              accept="image/*,application/pdf"
              className="border rounded px-2 py-2"
            />
            <button className="ml-2 bg-gray-800 text-white px-3 py-2 rounded">
              Upload Receipt
            </button>
          </form>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const res = await fetch("/api/upload/pdf", {
                method: "POST",
                body: fd,
              });
              if (res.ok) setFilters({ ...filters });
            }}
          >
            <input
              name="file"
              type="file"
              accept="application/pdf"
              className="border rounded px-2 py-2"
            />
            <button className="ml-2 bg-gray-800 text-white px-3 py-2 rounded">
              Upload PDF
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
