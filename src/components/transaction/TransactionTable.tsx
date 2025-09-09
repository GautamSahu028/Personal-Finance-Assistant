export function TransactionTable({ transactions }: { transactions: Tx[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
              Description
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-700">
                  {new Date(tx.occurredAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${
                      tx.type === "INCOME"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    {tx.type === "INCOME" ? "💰" : "💸"} {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {tx.category}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {tx.description || (
                    <span className="italic">No description</span>
                  )}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-semibold text-right ${
                    tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "EXPENSE" ? "-" : "+"}$
                  {(tx.amountCents / 100).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
