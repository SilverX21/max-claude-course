"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
    >
      Log out
    </button>
  );
}
