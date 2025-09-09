export function TransactionTable({ transactions }: { transactions: Tx[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 border-b border-gray-200">
              Date
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 border-b border-gray-200">
              Type
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 border-b border-gray-200">
              Category
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 border-b border-gray-200">
              Description
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 border-b border-gray-200">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="text-4xl text-gray-300">📊</div>
                  <p className="text-lg font-medium text-slate-600">
                    No transactions found
                  </p>
                  <p className="text-sm text-slate-500">
                    Add your first transaction to get started
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr
                key={tx.id}
                className={`hover:bg-gray-50 transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {new Date(tx.occurredAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm
                    ${
                      tx.type === "INCOME"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }
                  `}
                  >
                    <span className="mr-1 text-sm">
                      {tx.type === "INCOME" ? "💰" : "💸"}
                    </span>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700 capitalize">
                  {tx.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                  {tx.description || (
                    <span className="italic text-slate-400">
                      No description
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-bold text-right ${
                    tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg">
                    {tx.type === "EXPENSE" ? "-" : "+"}$
                    {(tx.amountCents / 100).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
