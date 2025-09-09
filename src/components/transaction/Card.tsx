export function Card({
  children,
  title,
  subtitle,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const baseClasses =
    "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden";

  return (
    <div className={`${baseClasses} ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          {title && (
            <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
