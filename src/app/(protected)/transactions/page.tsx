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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResponse, setParseResponse] = useState<any | null>(null);
  const [importResponse, setImportResponse] = useState<any | null>(null);

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

  async function handlePdfUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setParseResponse(null);
    setImportResponse(null);
    setLoading(true);

    try {
      const form = e.currentTarget as HTMLFormElement;
      const fileInput =
        form.querySelector<HTMLInputElement>('input[name="file"]');
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error("Please select a PDF file to upload.");
      }

      const file = fileInput.files[0];
      if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are supported.");
      }

      // Step 1: send PDF to parse endpoint
      const fd = new FormData();
      fd.append("file", file);

      const parseRes = await fetch("/api/upload/pdf/parse", {
        method: "POST",
        body: fd,
      });

      if (!parseRes.ok) {
        const txt = await parseRes.text().catch(() => "");
        const msg = txt || `Parse endpoint failed: ${parseRes.status}`;
        throw new Error(msg);
      }

      const parseJson = await parseRes.json().catch(() => null);
      if (!parseJson || !Array.isArray(parseJson.records)) {
        throw new Error(
          "Parse endpoint returned unexpected response. Expected { records: [...] }"
        );
      }
      // save parse response for UI
      setParseResponse(parseJson);

      // Optionally show a preview/confirm UI here before importing — omitted for brevity.

      // Step 2: POST parsed JSON to import endpoint
      const importPayload = {
        count: parseJson.count ?? parseJson.records.length,
        records: parseJson.records,
      };

      const importRes = await fetch("/api/upload/pdf/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(importPayload),
      });

      if (!importRes.ok) {
        const txt = await importRes.text().catch(() => "");
        const msg = txt || `Import endpoint failed: ${importRes.status}`;
        throw new Error(msg);
      }

      const importJson = await importRes.json().catch(() => null);
      if (!importJson) {
        throw new Error("Import endpoint returned invalid JSON");
      }
      setImportResponse(importJson);

      // Update filters / UI as you used to
      setFilters({ ...filters });
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("PDF upload/import error:", msg, err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Transaction Management
                </h1>
                <p className="mt-2 text-base text-slate-600 max-w-2xl">
                  Manage and track all your financial transactions with ease
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Total Records
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="xl:col-span-1 space-y-6">
            {/* Add Transaction Form */}
            <Card
              title="Add New Transaction"
              subtitle="Record a new income or expense"
            >
              <form onSubmit={onAddSubmit} className="space-y-4">
                <div className="space-y-4">
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

                <div className="pt-4 border-t border-gray-200">
                  <Button type="submit" className="w-full justify-center">
                    ➕ Add Transaction
                  </Button>
                </div>
              </form>
            </Card>

            {/* Import Section */}
            <Card
              title="Import Transactions"
              subtitle="Upload PDF statements to extract transactions"
            >
              <div className="space-y-4">
                <div className="text-center p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <div className="text-4xl mb-2">📄</div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Upload PDF Statement
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Automatically extract transactions from your bank statements
                  </p>

                  <form onSubmit={handlePdfUpload} className="space-y-3">
                    <Input
                      name="file"
                      type="file"
                      accept="application/pdf"
                      required
                      className="text-sm"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full justify-center"
                      disabled={loading}
                    >
                      {loading ? "⏳ Processing..." : "📤 Upload PDF"}
                    </Button>
                  </form>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
                      <div className="flex">
                        <div className="text-red-400 mr-2">⚠️</div>
                        <p className="text-sm text-red-700 font-medium">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Data Display */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filters */}
            <Card
              title="Filter Transactions"
              subtitle="Narrow down your search results"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Type"
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      type: e.target.value || undefined,
                    }))
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
                    setFilters((f) => ({
                      ...f,
                      end: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              <div className="pt-4 border-gray-200 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setPage(1);
                  }}
                  className="px-6"
                >
                  🔄 Clear Filters
                </Button>
              </div>
            </Card>

            {/* Transactions Table */}
            <Card
              title="Transaction History"
              subtitle={`Showing ${items.length} of ${total} transactions`}
            >
              <div className="overflow-hidden">
                <TransactionTable transactions={items} />
              </div>

              {/* Professional Pagination */}
              {total > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
                  <div className="text-sm text-slate-600">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.min((page - 1) * pageSize + 1, total)}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * pageSize, total)}
                    </span>{" "}
                    of <span className="font-medium">{total}</span> results
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5"
                    >
                      ← Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                page === pageNum
                                  ? "bg-blue-600 text-white font-medium"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      {totalPages > 5 && (
                        <span className="text-slate-400 px-2">...</span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1.5"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
