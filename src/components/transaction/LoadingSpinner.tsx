export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
    <div className="mt-4 text-center">
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Loading Transactions
      </h3>
      <p className="text-sm text-slate-600">
        Please wait while we fetch your transaction data...
      </p>
    </div>
  </div>
);
