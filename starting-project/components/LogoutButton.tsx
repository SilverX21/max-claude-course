"use client";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer text-sm px-3 py-1.5 rounded-md text-muted hover:text-fg hover:bg-surface transition-colors"
    >
      Log out
    </button>
  );
}
