export function Input({
  label,
  error,
  className = "",
  ...props
}: {
  label?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const baseInputClasses = `
    w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white
    text-slate-900 placeholder-slate-400 font-medium
    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
    transition-all duration-200 shadow-sm
    hover:border-gray-400
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
      <input className={`${baseInputClasses} ${errorClasses}`} {...props} />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
