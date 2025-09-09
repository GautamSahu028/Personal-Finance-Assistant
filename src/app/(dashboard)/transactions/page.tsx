"use client";
import { Button } from "@/components/transaction/Button";
import { Card } from "@/components/transaction/Card";
import { Input } from "@/components/transaction/Input";
import { Select } from "@/components/transaction/Select";
import { TransactionTable } from "@/components/transaction/TransactionTable";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Filters>({});

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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Transactions
              </h1>
              <p className="mt-2 text-slate-600">
                Manage and track all your financial transactions
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium mb-1">
                Total Records
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 space-y-8">
        {/* Add Transaction Form */}
        <Card
          title="Add New Transaction"
          subtitle="Record a new income or expense"
        >
          <form onSubmit={onAddSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select label="Transaction Type" name="type" required>
                <option value="EXPENSE">💸 Expense</option>
                <option value="INCOME">💰 Income</option>
              </Select>

              <Input
                label="Amount ($)"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />

              <Input
                label="Category"
                name="category"
                placeholder="e.g., Food, Salary, Rent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Description"
                name="description"
                placeholder="Optional description"
              />

              <Input
                label="Date & Time"
                name="occurredAt"
                type="datetime-local"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">➕ Add Transaction</Button>
            </div>
          </form>
        </Card>

        {/* Filters */}
        <Card
          title="Filter Transactions"
          subtitle="Narrow down your search results"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              label="Type"
              value={filters.type || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value || undefined }))
              }
            >
              <option value="">All Types</option>
              <option value="EXPENSE">💸 Expenses</option>
              <option value="INCOME">💰 Income</option>
            </Select>

            <Input
              label="Category"
              placeholder="Filter by category"
              value={filters.category || ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  category: e.target.value || undefined,
                }))
              }
            />

            <Input
              label="Start Date"
              type="date"
              value={filters.start || ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  start: e.target.value || undefined,
                }))
              }
            />

            <Input
              label="End Date"
              type="date"
              value={filters.end || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, end: e.target.value || undefined }))
              }
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setPage(1);
                }}
                className="w-full"
              >
                🔄 Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card
          title="Transaction History"
          subtitle={`Showing ${items.length} of ${total} transactions`}
        >
          <TransactionTable transactions={items} />

          {/* Pagination */}
          {total > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-slate-600">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to{" "}
                {Math.min(page * pageSize, total)} of {total} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Previous
                </Button>
                <span className="px-3 py-1.5 text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Import Section */}
        <Card
          title="Import Transactions"
          subtitle="Upload receipts or PDF statements to automatically extract transactions"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Upload */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">📷 Upload Receipt</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const res = await fetch("/api/upload/receipt", {
                    method: "POST",
                    body: fd,
                  });
                  if (res.ok) {
                    setFilters({ ...filters });
                    (e.currentTarget as HTMLFormElement).reset();
                  }
                }}
                className="space-y-3"
              >
                <Input
                  name="file"
                  type="file"
                  accept="image/*,application/pdf"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full bg-slate-500 py-2 hover:bg-slate-600 hover:cursor-pointer"
                  disabled={false}
                >
                  📤 Upload Receipt
                </Button>
              </form>
            </div>

            {/* PDF Upload */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">
                📄 Upload PDF Statement
              </h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const res = await fetch("/api/upload/pdf", {
                    method: "POST",
                    body: fd,
                  });
                  if (res.ok) {
                    setFilters({ ...filters });
                    (e.currentTarget as HTMLFormElement).reset();
                  }
                }}
                className="space-y-3"
              >
                <Input
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full bg-slate-500 py-2 hover:bg-slate-600 hover:cursor-pointer"
                  disabled={false}
                >
                  📤 Upload PDF
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
