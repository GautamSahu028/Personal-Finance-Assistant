export function Select({
  label,
  error,
  children,
  className = "",
  ...props
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const baseSelectClasses = `
    w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white
    text-slate-900 font-medium
    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
    transition-all duration-200 shadow-sm
    hover:border-gray-400 cursor-pointer
    appearance-none bg-no-repeat bg-right bg-[length:16px]
    pr-10
  `;

  const errorClasses = error
    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
    : "";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-slate-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={`${baseSelectClasses} ${errorClasses}`} {...props}>
          {children}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
