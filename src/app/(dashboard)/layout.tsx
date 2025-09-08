import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-white border-b">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          <a href="/dashboard" className="font-semibold">
            Personal Finance Assistant
          </a>
          <div className="space-x-4 text-sm">
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
            <a href="/transactions" className="hover:underline">
              Transactions
            </a>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="w-full">{children}</main>
    </>
  );
}
