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
  return (
    <div className={className}>
      {label && (
        <label
          className="block text-sm font-bold text-gray-900 mb-2"
          style={{ color: "#000000" }}
        >
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
          text-slate-900 
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
          transition-colors duration-200
          ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-500"
              : ""
          }
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
