"use client";
export function LogoutButton({ className = "" }: { className?: string }) {
  async function onClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        text-slate-600 hover:text-red-600 hover:bg-red-50 
        focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-50
        active:bg-red-100 active:scale-95
        flex items-center space-x-2
        ${className}
      `}
    >
      <span>🚪</span>
      <span>Logout</span>
    </button>
  );
}
