"use client";
export function LogoutButton() {
  async function onClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button onClick={onClick} className="text-red-600">
      Logout
    </button>
  );
}
