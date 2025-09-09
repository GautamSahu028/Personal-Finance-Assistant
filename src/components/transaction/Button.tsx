export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 active:bg-blue-800",
    secondary:
      "bg-slate-500 text-white hover:bg-slate-600 focus:ring-slate-300 active:bg-slate-700",
    outline:
      "border border-gray-300 text-slate-700 hover:bg-gray-50 focus:ring-blue-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
