export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className = "",
  ...props
}: {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 inline-flex items-center justify-center";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 active:bg-blue-800 shadow-sm",
    secondary:
      "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-300 active:bg-slate-800 shadow-sm",
    outline:
      "border-2 border-gray-300 text-slate-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-200 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[2rem]",
    md: "px-4 py-2.5 text-sm min-h-[2.5rem]",
    lg: "px-6 py-3 text-base min-h-[3rem]",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-current"
    : "";

  // Combine all classes, with custom className having precedence
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
