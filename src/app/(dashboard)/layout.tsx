"use client";
import { LogoutButton } from "@/components/LogoutButton";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/transactions", label: "Transactions", icon: "💳" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Brand/Logo */}
            <div className="flex items-center">
              <a
                href="/dashboard"
                className="text-xl font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors"
              >
                Personal Finance Assistant
              </a>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </a>
              ))}

              {/* Divider */}
              <div className="mx-2 h-6 w-px bg-gray-200"></div>

              {/* Logout Button */}
              <div className="ml-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </main>
    </>
  );
}
